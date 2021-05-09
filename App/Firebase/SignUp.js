import Firebase from './firebaseConfig';

export const SignUpUser = async (email, password) => {
    try {
        return await Firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
        return error;
    }
}