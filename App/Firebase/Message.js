import firebase from './firebaseConfig';
import moment from 'moment';

export const SendMessage = async (currentUserId, guestUserId, msgValue,imgSource) => {
    var todayDate=moment();
    try {
        return await firebase.
            database().
            ref('messages/' + currentUserId)
            .child(guestUserId).
            push({
                messege: {
                    sender: currentUserId,
                    reciever: guestUserId,
                    msg: msgValue,
                    image:imgSource,
                    date:todayDate.format('YYYY-MM-DD'),
                    time:todayDate.format('hh:mm A')
                },
            })
    } catch (error) {
        return error;
    }
}


export const RecieveMessage = async (currentUserId, guestUserId, msgValue,imgSource) => {
    try {
        var todayDate=moment();
        return await firebase.
            database().
            ref('messages/' + guestUserId)
            .child(currentUserId).
            push({
                messege: {
                    sender: currentUserId,
                    reciever: guestUserId,
                    msg: msgValue,
                    image:imgSource,
                    date:todayDate.format('YYYY-MM-DD'),
                    time:todayDate.format('hh:mm A')
                },
            })
    } catch (error) {
        return error;
    }
}