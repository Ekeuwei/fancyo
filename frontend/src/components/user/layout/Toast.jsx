import { useEffect, useState } from "react";
import { ToastContainer } from "../../../theme/ThemeStyle";
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from "react-redux";
import { clearToast } from "../../../app/user/userSlice";


const Toast = () => {
  const dispatch = useDispatch()

  const [display, setDisplay] = useState('none');
  const [animate, setAnimate] = useState('out');

  const { toast } = useSelector(state => state.user)
  const [type, setMessageType] = useState('won')

  useEffect(() => {

    if(animate==='in'){
        setDisplay('flex');

        const timer = setTimeout(() => {
          setAnimate('out');
        }, 5000);
        
        return () => clearTimeout(timer);
    }else{
        
        const timer = setTimeout(() => {
          setDisplay('none');
          dispatch(clearToast())
        }, 300);
        
        return () => clearTimeout(timer);
    }

  }, [animate, dispatch]);

  useEffect(()=>{
    if(toast){
      setAnimate('in');
      setMessageType(toast.type)
    }else{
      setAnimate('out');
    }
  },[toast])

  return <ToastContainer value={{animate, display, type}} >{toast?.message}</ToastContainer>

}

Toast.propTypes = {
    message: PropTypes.string,
    children: PropTypes.object,
}

export default Toast;
