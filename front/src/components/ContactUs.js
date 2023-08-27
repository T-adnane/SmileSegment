import React, { useState } from "react";
import {SendHorizonal } from "lucide-react";

import { Container, Row, Col } from "react-bootstrap";
import emailjs from '@emailjs/browser';
import "./ContactStyle.css";


export const ContactUs = () => {
  
  const formInitialDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  };

  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState('  Send');

  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    emailjs.sendForm(
      "service_7vdjfok",
       "template_b4gmkpx",
        e.target,
        "tutUDfL__czYnc2Hk").then((result) => {
          console.log(result.text);
          console.log("Message Sent");
      }, (error) => {
          console.log(error.text);
      });
        
    setButtonText("Sending...");
    setFormDetails(formInitialDetails);
  };

  return (
    <section className="contact" id="connect">
      <Container>
        <Row className="align-items-center">

        
          <Col xs={12} md={6}>
            <h2>Get In Touch</h2>
            <h3>Experiencing a technical problem? Interested in providing feedback on a beta feature? Feel free to inform us!</h3>
            <form onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} sm={6} className="px-1">
                <h4> First Name</h4>
                  <input
                    type="text"
                    name='FirstName'
                    placeholder="First Name"
                    value={formDetails.firstName}
                    onChange={(e) => onFormUpdate('firstName', e.target.value)}
                    required
                  />
                </Col>
                <Col xs={12} sm={6} className="px-1">
                  <h4> Last Name</h4>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formDetails.lastName}
                    onChange={(e) => onFormUpdate('lastName', e.target.value)}
                    required
                  />
                </Col>
                <Col xs={12} sm={6} className="px-1">
                <h4> Email Address</h4>
                  <input
                    type="email"
                    name='email'
                    placeholder="Email Address"
                    value={formDetails.email}
                    onChange={(e) => onFormUpdate('email', e.target.value)}
                    required
                  />
                </Col>
                
                <Col xs={12} className="px-1">
                <h4> Your Message</h4>
                  <textarea
                    rows="6"
                    name='message'
                    placeholder="Message"
                    value={formDetails.message}
                    onChange={(e) => onFormUpdate('message', e.target.value)}
                    required
                  ></textarea>
                  <Col xs={12} className="px-1 d-flex justify-content-end"></Col>
                  <button type="submit" className="d-flex align-items-center">
                  <SendHorizonal  size={18} strokeWidth={2} color="white" style={{ marginRight: "14px" }} />
                  
                    <span>{buttonText}</span>
                    
                  </button>

                </Col>
              </Row>
            </form>
          </Col>
          
        </Row>
      </Container>
    </section>
  );
  
};

export default ContactUs;
