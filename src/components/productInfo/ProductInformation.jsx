import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultProductImage from "../../assets/img/pages/noimg.jpg";
import { viewProduct, clearProduct } from "../../redux/catalog/products/productsActions";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
const ProductInformation = ({ productId }) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state);

  useEffect(() => {
    dispatch(viewProduct(productId));
    return () => {
      dispatch(clearProduct());
    };
  }, []);

  const renderSKUInfo = () => {
    if (products.selectedSKU) {
      return (
        <Card>
          <CardHeader>
            <h3>product information</h3>
          </CardHeader>
          <CardBody>
            <Row>
              <Col lg="12">
                <div className="mt-1">
                  <h4>Product Name : </h4>
                  <span>{products.selectedSKU.name}</span>
                  <h4 className="mt-2">Product SKU :</h4>
                  <span> {products.selectedSKU.sku}</span>
                </div>
                <div className="mt-1">
                  {products.selectedSKU.images.length > 0 && (
                    <img
                      src={
                        products.selectedSKU.images.find((image) => image.type.key === "IMAGE").path
                      }
                      height="160"
                      width="200"
                      alt=""
                    />
                  )}

                  {products.selectedSKU.images.length === 0 && (
                    <img src={defaultProductImage} height="140" width="190" alt="" />
                  )}
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      );
    }
  };
  return <div>{renderSKUInfo()}</div>;
};

export default ProductInformation;
