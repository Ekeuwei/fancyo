import React from 'react'
import { Accordion } from 'react-bootstrap'
import faqs from './data/faq.json'

const ContactUs = () => {
  return (
    <>
      <div>
          <h1>Contact Us</h1>
          <p>Thank you for your interest in Ebiwoni! We're here to assist you in any way we can. Whether you have questions, feedback, or just want to say hello, we'd love to hear from you.</p>
      </div>

      <div className="faq">
        <h2 className='faq-title'>Frequently Asked Questions</h2>
        <Accordion defaultActiveKey="0" flush>
          {faqs.map((faq, index) =>(
            <Accordion.Item eventKey={index} key={index}>
              <Accordion.Header>{faq.question}</Accordion.Header>
              <Accordion.Body style={{fontSize:"smaller"}}>{faq.answer}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
      <div className='contact'>
        <div className="logo">
          <img src="./images/logo.png" alt="Logo" />
        </div>
        <div className="address">
          <h5>Contact</h5>
          <p>50 Edepie school road, Yenagoa, Bayelsa, Nigeria</p>
          <p>support@ebiwoni.com</p>
        </div>

        <div className="community">
          <h5>Community</h5>
          <div className="">
            <i className="p-3 fa-lg fa fa-square-facebook" aria-hidden="true"></i>
            <i className="p-3 fa-lg fa fa-linkedin" aria-hidden="true"></i>
            <i className="p-3 fa-lg fa fa-twitter" aria-hidden="true"></i>
            <i className="p-3 fa-lg fa fa-instagram" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactUs