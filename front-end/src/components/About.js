import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { Card } from "./Card";
import projImg1 from "../assets/img/project-img1.png";
import projImg2 from "../assets/img/project-img2.png";
import projImg3 from "../assets/img/project-img3.png";
import projImg4 from "../assets/img/project-img4.png";
import projImg5 from "../assets/img/project-img10.png";
import projImg6 from "../assets/img/project-img6.png";
import projImg7 from "../assets/img/project-img7.png";
import projImg8 from "../assets/img/project-img8.png";
import projImg9 from "../assets/img/project-img9.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const About = () => {

  const team = [
    {
      nom: "Agdad Mariam",
      domaine: "Génie Informatique",
      imgUrl: projImg1,
      linkedin :'https://www.linkedin.com/in/mariam-agdad-44664b269/',
      github :'https://github.com/mariam-agdad',
      email : 'mariam.agdad08@gmail.com',

    },
    {
      nom: "Elhassnaoui Mohamed",
      domaine: "Science des données",
      imgUrl: projImg2,
      linkedin :'https://www.linkedin.com/in/mohamed-elhassnaoui-7a2162211/',
      github :'https://github.com/Elhassnaoui2001',
      email : 'mohamed2001elhassnaoui@gmail.com',
    },
    {
      nom: "Elmouwahid Ayoub",
      domaine: "Ingénierie des Systèmes d'Information et de Communication",
      imgUrl: projImg3,
      linkedin :'https://www.linkedin.com/in/ayoub-el-mouwahid-7a0424218/',
      github :'https://github.com/ELMOUWAHID-AYOUB',
      email : 'elmouwahid2001@gmail.com',
    },
    {
      nom: "Labrouki Yousra",
      domaine: "Génie Logiciel",
      imgUrl: projImg4,
      linkedin :'https://www.linkedin.com/in/ussra/',
      github :'https://github.com/Usra-Lab',
      email : 'yousralabrouki@gmail.com',
    },
    {
      nom: "Noutfi Fatima",
      domaine: "Intelligence Artificielle",
      imgUrl: projImg5,
      linkedin :'https://www.linkedin.com/in/fatima-noutfi-685a25254/?originalSubdomain=ma',
      github :'https://github.com/IA6DAM',
      email : 'fatima_noutfi@um5.ac.ma',
    },
    {
      nom: "Touzouz Adnane",
      domaine: "Inteligence Artificiele et Analyse des Données",
      imgUrl: projImg6,
      linkedin :'https://www.linkedin.com/in/adnane-touzouz/',
      github :'https://github.com/T-adnane',
      email : 'touzouzadnane0@gmail.com',
    },
  ];
  const supervisors = [
    {
      nom: "Mr Thierry Bertin",
      domaine: "Ingénieur et dentiste",
      imgUrl: projImg7,
      linkedin :'https://www.linkedin.com/company/3dsmartfactory/',
      github :'https://github.com/404',
      email : '3dsmartfactory@gmail.com',
    },
    {
      nom: "Mr Hamza Mouncif",
      domaine: "PhD researcher & Data scientist at 3D Smart Factory",
      imgUrl: projImg8,
      linkedin :'https://www.linkedin.com/in/hamzam0n/',
      github :'https://github.com/hamzam0n',
      email : 'monhamza1@gmail.com',
    },
    {
      nom: "Mr Amine Kassimi",
      domaine: "Data Science | Maching Learning | 3D Computer Vision",
      imgUrl: projImg9,
      linkedin :'https://www.linkedin.com/in/amine-kassimi/',
      github :'https://github.com/404',
      email : 'mrkassimi.amine@gmail.com',
    },
  ];

  return (
    <section className="project" id="project">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn": ""}>
                <Tab.Container id="projects-tabs" defaultActiveKey="first">
                  <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                    <Nav.Item>
                      <Nav.Link eventKey="first">Team</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">Supervisors</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                    <Tab.Pane eventKey="first">
                      <Row>
                        {
                          team.map((project, index) => {
                            return (
                              <Card
                                key={index}
                                {...project}
                                />
                            )
                          })
                        }
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                    <Row>
                        {
                          supervisors.map((project, index) => {
                            return (
                              <Card
                                key={index}
                                {...project}
                                />
                            )
                          })
                        }
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2}></img>
    </section>
  )
}