// Firebase Bookings Management
import { db, collection, addDoc, getDocs, query, where, orderBy } from './firebase-config.js';

// Fonction pour sauvegarder une réservation dans Firebase
export async function saveBooking(bookingData) {
    try {
        const docRef = await addDoc(collection(db, "bookings"), {
            ...bookingData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        console.log("✅ Réservation enregistrée avec l'ID:", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("❌ Erreur lors de l'enregistrement:", error);
        return { success: false, error: error.message };
    }
}

// Fonction pour récupérer toutes les réservations
export async function getAllBookings() {
    try {
        const querySnapshot = await getDocs(
            query(collection(db, "bookings"), orderBy("createdAt", "desc"))
        );
        
        const bookings = [];
        querySnapshot.forEach((doc) => {
            bookings.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return { success: true, bookings };
    } catch (error) {
        console.error("❌ Erreur lors de la récupération:", error);
        return { success: false, error: error.message };
    }
}

// Fonction pour récupérer les réservations d'un utilisateur
export async function getUserBookings(email) {
    try {
        const q = query(
            collection(db, "bookings"),
            where("email", "==", email),
            orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const bookings = [];
        
        querySnapshot.forEach((doc) => {
            bookings.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return { success: true, bookings };
    } catch (error) {
        console.error("❌ Erreur lors de la récupération:", error);
        return { success: false, error: error.message };
    }
}

// Fonction pour récupérer les disponibilités (dates réservées)
export async function getBookedDates() {
    try {
        const querySnapshot = await getDocs(
            query(
                collection(db, "bookings"),
                where("status", "in", ["pending", "confirmed"])
            )
        );
        
        const bookedDates = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            bookedDates.push({
                date: data.date,
                time: data.time,
                duration: data.duration
            });
        });
        
        return { success: true, dates: bookedDates };
    } catch (error) {
        console.error("❌ Erreur lors de la récupération:", error);
        return { success: false, error: error.message };
    }
}

// Fonction pour envoyer une notification email (via EmailJS ou autre service)
export async function sendBookingConfirmation(bookingData) {
    // Configuration EmailJS (à configurer selon vos besoins)
    const emailData = {
        to_email: bookingData.email,
        to_name: bookingData.name,
        service_name: bookingData.serviceName,
        booking_date: bookingData.date,
        booking_time: bookingData.time,
        price: bookingData.price,
        therapist_email: 'sabrine.sjk@gmail.com'
    };
    
    console.log("📧 Email de confirmation préparé:", emailData);
    
    // Ici vous pouvez intégrer EmailJS ou un autre service d'envoi d'emails
    // Pour l'instant, on utilise mailto comme fallback
    return { success: true };
}

// Rendre les fonctions disponibles globalement
window.firebaseBookings = {
    saveBooking,
    getAllBookings,
    getUserBookings,
    getBookedDates,
    sendBookingConfirmation
};

console.log("🔥 Firebase Bookings chargé et prêt!");
