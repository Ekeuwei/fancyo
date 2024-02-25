import PropTypes from 'prop-types'

const ModalAction = ({handleModalOpen, children}) => {
  return (
    <div onClick={handleModalOpen}>
        {children}
    </div>
  )
}
ModalAction.propTypes = {
    handleModalOpen: PropTypes.func,
    children: PropTypes.object
}

export default ModalAction