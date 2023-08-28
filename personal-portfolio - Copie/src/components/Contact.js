import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import emailjs from 'emailjs-com';
import contactImg from "../assets/img/contact-img.svg";

export const Contact = () => {
 
  const formInitialDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  }

  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState('Send');

  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value
    })
}



const handleSubmit = async (e) => {
  e.preventDefault();
  emailjs.sendForm('service_58o12vx','template_t1v7wp2',e.target,'-SO90Ralww5zdqRF_');
  setButtonText("Sending");
  setFormDetails(formInitialDetails);
};

  return (
    <section className="contact" id="connect">
      <Container>
        <Row className="align-items-center">

          <Col size={12} md={6}>
                <img  src={contactImg} alt="Contact Us"/>
          </Col>

          <Col size={12} md={6}>
                <h2>Get In Touch</h2>
                <form  onSubmit={handleSubmit}>
                  <Row>
                    <Col size={12} sm={6} className="px-1">
                      <input type="text" name='FirstName' placeholder="First Name" value={formDetails.firstName} onChange={(e) => onFormUpdate('firstName', e.target.value)} required />
                    </Col>
                    <Col size={12} sm={6} className="px-1">
                      <input type="text" placeholder="Last Name"  value={formDetails.lastName} onChange={(e) => onFormUpdate('lastName', e.target.value)} required/>
                    </Col>
                    <Col size={12} sm={6} className="px-1">
                      <input type="email" name='email'placeholder="Email Address"  value={formDetails.email} onChange={(e) => onFormUpdate('email', e.target.value)} required/>
                    </Col>
                    <Col size={12} sm={6} className="px-1">
                      <input type="tel"  placeholder="Phone No." value={formDetails.phone} onChange={(e) => onFormUpdate('phone', e.target.value)} required/>
                    </Col>
                    <Col size={12} className="px-1">
                      <textarea rows="6" name='message' placeholder="Message" value={formDetails.message}onChange={(e) => onFormUpdate('message', e.target.value)} required></textarea>
                      <button type="submit" ><span>{buttonText}</span></button>
                    </Col>
                  </Row>
                </form>
          </Col>
        </Row>
      </Container>
    </section>
  )
}