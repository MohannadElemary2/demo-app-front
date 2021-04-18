import React, { useEffect, useState } from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import { connect, useDispatch } from "react-redux";
import Spinner from "../../../components/@vuexy/spinner/Loading-spinner";
import { history } from "../../../history";
import { viewAttribute, clearAttribute } from "../../../redux/catalog/attributes/attributesActions";
import {
  clearBreadCrumbData,
  updateBreadCrumbData,
} from "../../../redux/BreadCrumb/BreadCrumbActions";
/**
 * Attributes Component
 * @param {props} ReactProps
 */
const AttributeDetails = ({ match, viewAttribute, attributeInfo, clearAttribute }) => {
  const [initialValues, setInitialValues] = useState(() => "");
  const dispatch = useDispatch();

  // getting attribute info on mount
  useEffect(() => {
    viewAttribute(match.params.id);
  }, [viewAttribute, match.params.id]);

  // adding attribute info coming from server to the initial values
  useEffect(() => {
    if (attributeInfo) {
      setInitialValues(attributeInfo);
      dispatch(
        updateBreadCrumbData({
          breadCrumbTitle: "Attribute Details",
          breadCrumbItems: [
            {
              title: `Attribute Details ( ${attributeInfo.name} )`,
            },
          ],
        }),
      );
    } else if (attributeInfo === "noData") {
      setInitialValues("noData");
    }
    return () => {
      clearAttribute();
    };
  }, [clearAttribute, attributeInfo, initialValues]);

  const renderAttribute = () => {
    if (initialValues && initialValues !== "noData") {
      return (
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <div className="mt-1">
                  <h6>Attribute's Name :</h6>
                  <p>{initialValues.name}</p>
                </div>
                <hr />

                <div className="mt-1">
                  <h6>Attribute's Type :</h6>
                  <p>{initialValues.type.description}</p>
                </div>
                <hr />
                <div className="mt-1">
                  <h6 className="pb-1">Attribute's Variations :</h6>

                  <ul className="list-style-circle ">
                    <Row>
                      {initialValues.variations.map((v) => (
                        <Col key={v.id} sm="4">
                          <li className="pb-1">{v.name}</li>
                        </Col>
                      ))}
                    </Row>
                  </ul>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Button
              color="primary"
              type="button"
              onClick={() => history.push(`/catalog/attributes`)}
            >
              Close
            </Button>
          </Col>
        </Row>
      );
    }
    if (initialValues === "noData") {
      return (
        <Card className="mt-2">
          <CardBody>
            <h2 className="text-center"> There is no attribute with this number</h2>
          </CardBody>
        </Card>
      );
    }
    return <Spinner />;
  };

  return <>{renderAttribute()}</>;
};

const mapDispatchToProps = {
  viewAttribute,
  clearAttribute,
};

const mapStateToProps = (state) => ({
  attributeInfo: state.attributes.viewedAttribute,
  loaders: state.loaders,
});

export default connect(mapStateToProps, mapDispatchToProps)(AttributeDetails);
