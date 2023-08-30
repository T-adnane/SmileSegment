import { Col } from "react-bootstrap";

export const Card = ({ nom, domaine, imgUrl,linkedin,github,email }) => {
  return (
    <Col size={12} sm={6} md={4}>
      <div className="proj-imgbx">
        <img src={imgUrl} />
        <div className="proj-txtx">
          <h4>{nom}</h4>
          <div>{domaine}</div>
          <br></br>
          <br></br>
          <div class="social_link">
                <a href={linkedin} target="_blank"><i class="fa fa-linkedin"></i></a>
                <a href={github} target="_blank"><i class="fa fa-github"></i></a>
                <a href={'mailto:'+email} target="_blank"><i class="ti-email"></i></a>
              </div>
        </div>
      </div>
    </Col>
  )
}