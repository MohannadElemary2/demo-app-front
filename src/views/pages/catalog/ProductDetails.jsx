import React, { useEffect, useState } from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import { connect, useDispatch } from "react-redux";
import Spinner from "../../../components/@vuexy/spinner/Loading-spinner";
import "./ProductDetails.scss";
import { history } from "../../../history";
import defaultProductImage from "../../../assets/img/pages/noimg.jpg";
import { viewProduct, clearProduct } from "../../../redux/catalog/products/productsActions";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";
import {
  clearBreadCrumbData,
  updateBreadCrumbData,
} from "../../../redux/BreadCrumb/BreadCrumbActions";
/**
 * Product details Component
 * @param {props} ReactProps
 */
const ProductDetails = ({ match, viewProduct, productInfo, clearProduct }) => {
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState(() => "");

  // getting Product info on mount
  useEffect(() => {
    viewProduct(match.params.id);
  }, [viewProduct, match.params.id]);

  // adding Product info coming from server to the initial values
  useEffect(() => {
    if (productInfo) {
      setInitialValues(productInfo);
      dispatch(
        updateBreadCrumbData({
          breadCrumbTitle: "Product Details",
          breadCrumbItems: [
            {
              title: `Product Details ( ${productInfo.name} )`,
            },
          ],
        }),
      );
    } else if (productInfo === "noData") {
      setInitialValues("noData");
    }
    return () => {
      clearProduct();
    };
  }, [clearProduct, productInfo, initialValues]);

  const renderProduct = () => {
    if (initialValues && initialValues !== "noData") {
      return (
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <Row>
                  <Col sm="12">
                    <div className="mt-1">
                      <h6>Product Name :</h6>
                      <p>{initialValues.name}</p>
                    </div>

                    <div className="mt-1">
                      {initialValues.images?.length > 0 && (
                        <img
                          src={
                            initialValues.images?.find((image) => image.type.key === "IMAGE").path
                          }
                          height="160"
                          width="200"
                          alt=""
                        />
                      )}

                      {initialValues.images?.length === 0 && (
                        <img src={defaultProductImage} height="140" width="190" alt="" />
                      )}
                    </div>
                  </Col>
                </Row>

                <hr />

                <div className="mt-1">
                  <h6>Product Barcode :</h6>
                  <p>{initialValues.barcode ? initialValues.barcode : "No barcode"}</p>
                </div>
                <hr />
                <div className="mt-1">
                  <h6>Product SKU :</h6>
                  <p>{initialValues.sku}</p>
                </div>
                <hr />
                <div className="mt-1">
                  <h6>Product type :</h6>
                  <p>{initialValues.type?.description}</p>
                </div>
                <hr />

                <div className="mt-1">
                  <h6>Product Status :</h6>
                  <ul className="list-style-circle ">
                    <Row>
                      {initialValues.sales_channels?.map((v) => (
                        <Col key={v.id} sm="4">
                          <li className="pb-1">
                            {v.name} :{v.is_active ? " Enabled " : " Disabled"}
                          </li>
                        </Col>
                      ))}
                    </Row>
                  </ul>
                </div>

                <hr />

                <div className="mt-1">
                  <h6>Product Categories :</h6>
                  <ul className="list-style-circle ">
                    <Row>
                      {initialValues.categories?.map((v) => (
                        <Col key={v.id} sm="4">
                          <li className="pb-1">{v.name}</li>
                        </Col>
                      ))}
                    </Row>
                  </ul>
                </div>
                <hr />

                <div className="mt-1">
                  <h6>Product variations :</h6>

                  <Row className="mb-1 mt-2">
                    <Col sm="4">
                      <h5>Attribute</h5>{" "}
                    </Col>
                    <Col sm="8">
                      <h5>Options </h5>
                    </Col>
                  </Row>

                  {initialValues.variations?.map((v) => (
                    <div key={v.id}>
                      <Row className="mb-2">
                        <Col sm="4">{v.name}</Col>
                        <Col sm="8">
                          <div className="variation-value">
                            {v.variations?.map((variation) => (
                              <p key={variation.id}>{variation.name}</p>
                            ))}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))}

                  {initialValues.custom_variations?.map((v) => (
                    <div key={v.id}>
                      <Row className="mb-2">
                        <Col sm="4">{v.name}</Col>
                        <Col sm="8" id={`custom-${v.id}`}>
                          <div className="variation-value">
                            {/* <p>{v.custom_value.replace(/(<([^>]+)>)/gi, "")}</p> */}

                            {v.name === "Featured" ? (
                              <p>{v.custom_value === 0 ? "no" : "yes"}</p>
                            ) : (
                              <p>{v.custom_value.replace(/(<([^>]+)>)/gi, "")}</p>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Button color="primary" type="button" onClick={() => history.push(`/catalog/products`)}>
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
            <h2 className="text-center"> There is no product with this number</h2>
          </CardBody>
        </Card>
      );
    }
    return <Spinner />;
  };

  return <>{renderProduct()}</>;
};

const mapDispatchToProps = {
  viewProduct,
  clearProduct,
};

const mapStateToProps = (state) => ({
  productInfo: state.products.selectedSKU,
  loaders: state.loaders,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
