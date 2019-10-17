import * as fb from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBHcTkGUmNUjQvEASaXasvWUiE2dNGAPdg",
    authDomain: "food-delivery23.firebaseapp.com",
    databaseURL: "https://food-delivery23.firebaseio.com",
    projectId: "food-delivery23",
    storageBucket: "food-delivery23.appspot.com",
    messagingSenderId: "443235899488",
    appId: "1:443235899488:web:a4a015aaf500e04b"
  };

  fb.initializeApp(firebaseConfig)

//   ...Constants
let db = fb.firestore()
let auth = fb.auth();

//_______facebook login_____________
function fbLogin(token){
    const credential = fb.auth.FacebookAuthProvider.credential(token);
    return auth.signInWithCredential(credential)
      }
      //_____________end-fblogin_______________

    //   Store user...
    function user_register(uid,user){
        db.collection('crime_alert').doc('robbery').collection('user').doc(uid).set(user);
    }

// ....Adding Crime
function crime_added (data) {
    db.collection('crime_alert').doc('robbery').collection('All').add(data).then(success=>{
console.log('robbery added')
    }).catch(error=>{
        console.log('robbery_added_error',error.message)
    })
}

export {
    fbLogin,
    crime_added,
    user_register,
}
export default fb