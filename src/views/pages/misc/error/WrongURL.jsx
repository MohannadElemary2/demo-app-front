import React from "react";
import { FormattedMessage } from "react-intl";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import errorImg from "../../../../assets/img/pages/404.png";
import { history } from "../../../../history";

const WrongURL = () => (
  <>
    <Row className="m-0">
      <Col sm="12">
        <Card className="auth-card bg-transparent shadow-none rounded-0 mb-0 w-100">
          <CardBody className="text-center">
            <img src={errorImg} alt="ErrorImg" className="img-fluid align-self-center" />
            <h1 className="font-large-2 my-1">
              <FormattedMessage id="The requested page on the URL does not exist" />
            </h1>
            <Button
              color="primary"
              size="lg"
              className="mt-2"
              onClick={() => {
                history.push("/");
              }}
            >
              Back Home
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </>
);

export default WrongURL;
