import React, { useEffect, useRef, useState } from 'react';
import { PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';
import { getUser } from '../../utils/firestoreUtils';
import { setAccessGranted } from '../../redux/ducks/admin';
import { useDispatch } from 'react-redux';

const PhoneAuth = () => {
    const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = useRef(null);

  useEffect(() => {
    const setupRecaptcha = () => {
      // Ensure that the recaptchaVerifier is initialized correctly 
      console.log("before recaptcha is done")
    //   auth.settings.appVerificationDisabledForTesting = true;
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          console.log("Recaptcha verified");
        },
        'expired-callback': () => {
          console.log("Recaptcha expired, please try again.");
        },
        // 'appVerificationDisabledForTesting': true // Disable app verification for testing
      });
      console.log(" after recaptcha is done")
      // You may need to render the recaptcha manually if 'invisible'
    //   window.recaptchaVerifier.render();
    };

    setupRecaptcha();
  }, []);

  // Set up recaptcha verifier
  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        console.log("Recaptcha verified");
      }
    }, auth);
  };

  const handleSendOtp = async () => {
    if (phoneNumber === "" || phoneNumber.length < 13) {
      setError("Please enter a valid phone number.");
      //return;
    }
    setError('');
    setLoading(true);

    // setUpRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    console.log("aftyer recaptcha: ")
    
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      console.log("OTP sent");
    } catch (error) {
      setError("Failed to send OTP. Try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp === "") {
      setError("Please enter the OTP.");
      return;
    }
    setError('');
    setLoading(true);

    try {
      const credential =  PhoneAuthProvider.credential(verificationId, otp);
      const user = await signInWithCredential(auth, credential);
      console.log("User signed in successfully", user);
      const userData = await getUser(user.user.uid);
      if(userData && userData.admin) {
        console.log('logged in')
        dispatch(setAccessGranted(true));
      };
    //   console.log('id: ', user);
      setError('');
    } catch (error) {
      setError("Invalid OTP. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
/*
  function msg(obj) {
    dispatch(addMessages(obj))
    setTimeout(() => {
    dispatch(shiftMessage())
    }, 3000);
}*/
/*
async function confirmVerificationCode() {
    // dispatch(toggleLoading(true))
    setLoading(true);
    try {
    // setTriedToConfirm(true)
    const credential = PhoneAuthProvider.credential(
        verificationId,
        otp
    );
    await signInWithCredential(auth, credential)
        // msg({status:'good',content:'Phone authentication successful 👍'})
        //setMsg('Phone authentication successful 👍',clearMsg())
        // dispatch(setAppUser(user))
        //setUp(user.email)
        //handleSignOut()
        //console.log('navigating now...')
        // dispatch(toggleLoading(true))
        //console.log('before')
        // navigation.navigate(nextPage)
        console.log('success, after: ')
    } catch (err) {
        // msg({status:'bad',content:`Error: ${err.message}`})
        //setMsg(`Error: ${err.message}`,clearMsg());
        setError("error logging in")
        console.log(err)
    }
    // dispatch(toggleLoading(false))
    setLoading(false);
}

async function sendVerificationCode() {
    // The FirebaseRecaptchaVerifierModal ref implements the
    // FirebaseAuthApplicationVerifier interface and can be
    // passed directly to `verifyPhoneNumber`.
    //dispatch(toggleLoading(true))
    setLoading(true);
    try {
    const phoneProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneProvider.verifyPhoneNumber(
        `+1${phoneNumber}`,
        recaptchaVerifier.current
    );
    setVerificationId(verificationId);
    // dispatch(setVerificationCodeSent(true))
    // msg({status:'good',content:'Verification code has been sent to your phone.'})
    //setMsg('Verification code has been sent to your phone.',clearMsg());
    } catch (err) {
        // msg({status:'bad',content:`Error: ${err.message}`})
        //setMsg(`Error: ${err.message}`,clearMsg());
        setError("error sending otp")
        console.log(err)
    }
    setLoading(false);
    // dispatch(toggleLoading(false))

}*/

  return (
    <div>
      <h3>Phone Authentication</h3>

      <div>
        <label>Phone Number:</label>
        <input 
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1234567890"
        />
        <button onClick={handleSendOtp} disabled={loading}>Send OTP</button>
      </div>

      {verificationId && (
        <div>
          <label>OTP:</label>
          <input 
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={handleVerifyOtp} disabled={loading}>Verify OTP</button>
        </div>
      )}

      <div id="recaptcha-container"></div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PhoneAuth;
