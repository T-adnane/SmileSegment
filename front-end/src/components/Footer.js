import { Container, Row } from "react-bootstrap";
import { Prediction } from "./Prediction";

export const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <Container>
        <Row className="align-items-center">
          <Prediction />
        </Row>
      </Container>
    </footer>
  )
}
