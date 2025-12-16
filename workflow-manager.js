// Workflow Management System
import { db, auth, collection, addDoc, getDocs, getDoc, doc, updateDoc, query, where, orderBy } from './firebase-config.js';

// ===================================
// PROFIL CLIENT
// ===================================
export async function createOrUpdateClientProfile(clientData) {
    try {
        // Vérifier si le profil existe déjà
        const q = query(collection(db, "clients"), where("email", "==", clientData.email));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            // Créer un nouveau profil
            const docRef = await addDoc(collection(db, "clients"), {
                ...clientData,
                totalBookings: 1,
                totalSpent: clientData.amount || 0,
                firstBookingDate: new Date().toISOString(),
                lastBookingDate: new Date().toISOString(),
                loyaltyPoints: Math.floor((clientData.amount || 0) / 10),
                status: 'active',
                tags: ['nouveau-client'],
                notes: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            console.log('✅ Nouveau profil client créé:', docRef.id);
            return { success: true, id: docRef.id, isNew: true };
        } else {
            // Mettre à jour le profil existant
            const clientDoc = querySnapshot.docs[0];
            const currentData = clientDoc.data();
            
            await updateDoc(doc(db, "clients", clientDoc.id), {
                totalBookings: (currentData.totalBookings || 0) + 1,
                totalSpent: (currentData.totalSpent || 0) + (clientData.amount || 0),
                lastBookingDate: new Date().toISOString(),
                loyaltyPoints: (currentData.loyaltyPoints || 0) + Math.floor((clientData.amount || 0) / 10),
                updatedAt: new Date().toISOString()
            });
            
            console.log('✅ Profil client mis à jour:', clientDoc.id);
            return { success: true, id: clientDoc.id, isNew: false };
        }
    } catch (error) {
        console.error('❌ Erreur profil client:', error);
        return { success: false, error: error.message };
    }
}

// ===================================
// GÉNÉRATION DE NUMÉROS
// ===================================
async function generateBookingNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Compter les réservations du mois
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).toISOString();
    
    const q = query(
        collection(db, "bookings"),
        where("createdAt", ">=", startOfMonth),
        where("createdAt", "<=", endOfMonth)
    );
    
    const snapshot = await getDocs(q);
    const count = snapshot.size + 1;
    
    return `RES${year}${month}${count.toString().padStart(4, '0')}`;
}

async function generateInvoiceNumber(bookingNumber) {
    return bookingNumber.replace('RES', 'FACT');
}

async function generateQuoteNumber(bookingNumber) {
    return bookingNumber.replace('RES', 'DEV');
}

// ===================================
// CRÉATION RÉSERVATION COMPLÈTE
// ===================================
export async function createFullBooking(bookingData) {
    try {
        console.log('📝 Création de la réservation complète...');
        
        // 1. Générer les numéros
        const bookingNumber = await generateBookingNumber();
        const quoteNumber = await generateQuoteNumber(bookingNumber);
        
        // 2. Créer la réservation
        const booking = {
            ...bookingData,
            bookingNumber: bookingNumber,
            quoteNumber: quoteNumber,
            invoiceNumber: null, // Généré lors de la confirmation
            status: 'pending',
            paymentStatus: 'unpaid',
            workflow: {
                created: new Date().toISOString(),
                quoteSent: new Date().toISOString(),
                confirmed: null,
                invoiceSent: null,
                paid: null,
                completed: null
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const bookingRef = await addDoc(collection(db, "bookings"), booking);
        console.log('✅ Réservation créée:', bookingRef.id);
        
        // 3. Créer ou mettre à jour le profil client
        const profileResult = await createOrUpdateClientProfile({
            firstname: bookingData.firstname,
            lastname: bookingData.lastname,
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
            amount: bookingData.total
        });
        
        // 4. Générer le devis
        const quote = await generateQuoteDocument({
            ...booking,
            id: bookingRef.id,
            clientId: profileResult.id
        });
        
        // 5. Créer l'historique
        await addDoc(collection(db, "history"), {
            type: 'booking_created',
            bookingId: bookingRef.id,
            bookingNumber: bookingNumber,
            clientEmail: bookingData.email,
            description: `Nouvelle réservation créée: ${bookingData.serviceName}`,
            timestamp: new Date().toISOString()
        });
        
        // 6. Envoyer les notifications
        await sendBookingNotifications(booking, quote);
        
        return {
            success: true,
            bookingId: bookingRef.id,
            bookingNumber: bookingNumber,
            quoteNumber: quoteNumber,
            quote: quote,
            clientId: profileResult.id,
            isNewClient: profileResult.isNew
        };
        
    } catch (error) {
        console.error('❌ Erreur création réservation:', error);
        return { success: false, error: error.message };
    }
}

// ===================================
// GÉNÉRATION DOCUMENTS
// ===================================
async function generateQuoteDocument(bookingData) {
    const quote = {
        number: bookingData.quoteNumber,
        bookingNumber: bookingData.bookingNumber,
        date: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
        
        // Informations client
        client: {
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone
        },
        
        // Informations prestation
        service: {
            name: bookingData.serviceName,
            date: bookingData.date,
            time: bookingData.time,
            duration: bookingData.duration,
            participants: bookingData.participants
        },
        
        // Tarification
        pricing: {
            unitPrice: bookingData.price,
            quantity: bookingData.participants,
            subtotal: bookingData.price * bookingData.participants,
            discount: bookingData.discount,
            promoDiscount: bookingData.promoDiscount,
            total: bookingData.total,
            tva: 0 // TVA non applicable pour services thérapeutiques
        },
        
        // Conditions
        terms: [
            'Devis valable 30 jours',
            'Acompte de 30% à la réservation',
            'Solde à régler le jour de la séance',
            'Annulation gratuite jusqu\'à 48h avant la séance'
        ],
        
        status: 'sent',
        createdAt: new Date().toISOString()
    };
    
    // Sauvegarder le devis
    const quoteRef = await addDoc(collection(db, "quotes"), quote);
    console.log('✅ Devis généré:', quoteRef.id);
    
    return { ...quote, id: quoteRef.id };
}

export async function generateInvoiceDocument(bookingId) {
    try {
        const bookingDoc = await getDoc(doc(db, "bookings", bookingId));
        if (!bookingDoc.exists()) {
            throw new Error('Réservation non trouvée');
        }
        
        const bookingData = bookingDoc.data();
        const invoiceNumber = await generateInvoiceNumber(bookingData.bookingNumber);
        
        const invoice = {
            number: invoiceNumber,
            bookingNumber: bookingData.bookingNumber,
            quoteNumber: bookingData.quoteNumber,
            date: new Date().toISOString(),
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 jours
            
            // Informations client
            client: {
                name: bookingData.name,
                email: bookingData.email,
                phone: bookingData.phone
            },
            
            // Informations prestation
            service: {
                name: bookingData.serviceName,
                date: bookingData.date,
                time: bookingData.time,
                duration: bookingData.duration,
                participants: bookingData.participants
            },
            
            // Tarification
            pricing: {
                unitPrice: bookingData.price,
                quantity: bookingData.participants,
                subtotal: bookingData.price * bookingData.participants,
                discount: bookingData.discount,
                promoDiscount: bookingData.promoDiscount,
                total: bookingData.total,
                tva: 0,
                paid: 0,
                remaining: bookingData.total
            },
            
            // Paiements
            payments: [],
            
            // Statut
            status: 'pending',
            paymentStatus: 'unpaid',
            
            createdAt: new Date().toISOString()
        };
        
        // Sauvegarder la facture
        const invoiceRef = await addDoc(collection(db, "invoices"), invoice);
        
        // Mettre à jour la réservation
        await updateDoc(doc(db, "bookings", bookingId), {
            invoiceNumber: invoiceNumber,
            'workflow.invoiceSent': new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        // Historique
        await addDoc(collection(db, "history"), {
            type: 'invoice_generated',
            bookingId: bookingId,
            invoiceNumber: invoiceNumber,
            clientEmail: bookingData.email,
            description: `Facture générée: ${invoiceNumber}`,
            timestamp: new Date().toISOString()
        });
        
        console.log('✅ Facture générée:', invoiceRef.id);
        return { success: true, invoice: { ...invoice, id: invoiceRef.id } };
        
    } catch (error) {
        console.error('❌ Erreur génération facture:', error);
        return { success: false, error: error.message };
    }
}

// ===================================
// CONFIRMATION RÉSERVATION
// ===================================
export async function confirmBooking(bookingId) {
    try {
        // Mettre à jour la réservation
        await updateDoc(doc(db, "bookings", bookingId), {
            status: 'confirmed',
            'workflow.confirmed': new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        // Générer la facture
        const invoiceResult = await generateInvoiceDocument(bookingId);
        
        // Historique
        const bookingDoc = await getDoc(doc(db, "bookings", bookingId));
        const bookingData = bookingDoc.data();
        
        await addDoc(collection(db, "history"), {
            type: 'booking_confirmed',
            bookingId: bookingId,
            bookingNumber: bookingData.bookingNumber,
            clientEmail: bookingData.email,
            description: `Réservation confirmée: ${bookingData.bookingNumber}`,
            timestamp: new Date().toISOString()
        });
        
        console.log('✅ Réservation confirmée');
        return { success: true, invoice: invoiceResult.invoice };
        
    } catch (error) {
        console.error('❌ Erreur confirmation:', error);
        return { success: false, error: error.message };
    }
}

// ===================================
// ENREGISTREMENT PAIEMENT
// ===================================
export async function recordPayment(invoiceId, paymentData) {
    try {
        const invoiceDoc = await getDoc(doc(db, "invoices", invoiceId));
        if (!invoiceDoc.exists()) {
            throw new Error('Facture non trouvée');
        }
        
        const invoice = invoiceDoc.data();
        const payments = invoice.payments || [];
        
        const payment = {
            id: `PAY${Date.now()}`,
            amount: paymentData.amount,
            method: paymentData.method, // 'cash', 'card', 'transfer', 'check'
            date: paymentData.date || new Date().toISOString(),
            reference: paymentData.reference || '',
            notes: paymentData.notes || ''
        };
        
        payments.push(payment);
        
        const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
        const remaining = invoice.pricing.total - totalPaid;
        const paymentStatus = remaining <= 0 ? 'paid' : (totalPaid > 0 ? 'partial' : 'unpaid');
        
        // Mettre à jour la facture
        await updateDoc(doc(db, "invoices", invoiceId), {
            payments: payments,
            'pricing.paid': totalPaid,
            'pricing.remaining': remaining,
            paymentStatus: paymentStatus,
            updatedAt: new Date().toISOString()
        });
        
        // Mettre à jour la réservation
        const bookingQuery = query(
            collection(db, "bookings"),
            where("invoiceNumber", "==", invoice.number)
        );
        const bookingSnapshot = await getDocs(bookingQuery);
        
        if (!bookingSnapshot.empty) {
            const bookingDoc = bookingSnapshot.docs[0];
            await updateDoc(doc(db, "bookings", bookingDoc.id), {
                paymentStatus: paymentStatus,
                'workflow.paid': paymentStatus === 'paid' ? new Date().toISOString() : null,
                updatedAt: new Date().toISOString()
            });
        }
        
        // Historique
        await addDoc(collection(db, "history"), {
            type: 'payment_recorded',
            invoiceId: invoiceId,
            invoiceNumber: invoice.number,
            amount: paymentData.amount,
            method: paymentData.method,
            description: `Paiement enregistré: ${paymentData.amount}€ (${paymentData.method})`,
            timestamp: new Date().toISOString()
        });
        
        console.log('✅ Paiement enregistré');
        return { success: true, payment, totalPaid, remaining, paymentStatus };
        
    } catch (error) {
        console.error('❌ Erreur enregistrement paiement:', error);
        return { success: false, error: error.message };
    }
}

// ===================================
// NOTIFICATIONS
// ===================================
async function sendBookingNotifications(booking, quote) {
    // Email au client
    console.log('📧 Envoi notification client:', booking.email);
    
    // Email au thérapeute
    console.log('📧 Envoi notification thérapeute: sabrine.sjk@gmail.com');
    
    // SMS optionnel
    console.log('📱 SMS optionnel:', booking.phone);
    
    return { success: true };
}

// ===================================
// HISTORIQUE
// ===================================
export async function getClientHistory(email) {
    try {
        const q = query(
            collection(db, "history"),
            where("clientEmail", "==", email),
            orderBy("timestamp", "desc")
        );
        
        const snapshot = await getDocs(q);
        const history = [];
        
        snapshot.forEach(doc => {
            history.push({ id: doc.id, ...doc.data() });
        });
        
        return { success: true, history };
    } catch (error) {
        console.error('❌ Erreur récupération historique:', error);
        return { success: false, error: error.message };
    }
}

// Exposer globalement
window.workflowManager = {
    createFullBooking,
    confirmBooking,
    generateInvoiceDocument,
    recordPayment,
    getClientHistory,
    createOrUpdateClientProfile
};

console.log('🔄 Workflow Manager chargé');
