import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCluPJBs_tg5TBONPz73u-PWCoGzXY-GOM",
    authDomain: "my-to-do-e1d29.firebaseapp.com",
    projectId: "my-to-do-e1d29",
    storageBucket: "my-to-do-e1d29.appspot.com",
    messagingSenderId: "501098071472",
    appId: "1:501098071472:web:bd9a76eb3a577ea3350275",
    measurementId: "G-82Y4KCHSJB"
};


class Firebase{
    constructor(callback) {
        this.init(callback)
    }

    init(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig)
        }

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback(null, user)
            } else {
                firebase
                    .auth()
                    .signInAnonymously()
                    .catch(error => {
                        callback(error)
                    });
            }
        });
    }

    getLists(callback) {
        let ref = this.ref.orderBy("name");

        this.unsubscribe = ref.onSnapshot(snapshot => {
            lists = [];

            snapshot.forEach(doc => {
                lists.push({id: doc.id, ...doc.data()});
            });

            callback(lists);
        });
    }

    addList(list) {
        let ref = this.ref;

        ref.add(list);
    }

    updateList(list) {
        let ref = this.ref;
        
        ref.doc(list.id).update(list);
    }

    deleteList(list){
        let ref = this.ref;

        ref.doc(list.id).delete();
    }

    get userId() {
        return firebase.auth().currentUser.uid;
    }

    get ref() {
        return firebase
            .firestore()
            .collection("users")
            .doc(this.userId)
            .collection("lists");
    }

    detach() {
        this.unsubscribe();
    }
}

export default Firebase;