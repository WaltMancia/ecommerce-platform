import Stripe from 'stripe';

// Instancia única de Stripe con tu secret key
// Siempre se inicializa una sola vez y se reutiliza
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;