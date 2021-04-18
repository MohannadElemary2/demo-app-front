/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
import React, { Suspense } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { history } from "./history";
import Spinner from "./components/@vuexy/spinner/Loading-spinner";
import { ContextLayout } from "./utility/context/Layout";
import ScrollToTop from "./components/shared/ScrollToTop";

// all routes
import * as R from "./Routes";
import AppBreadCrumb from "./components/shared/AppBreadCrumb";

// Set Layout and Component Using App Route
const RouteConfig = ({ component: Component, fullLayout, documentTitle, ...rest }) => {
  const { breadCrumb } = useSelector((state) => state);
  return (
    <Route
      {...rest}
      render={(props) => (
        <ContextLayout.Consumer>
          {(context) => {
            const LayoutTag = fullLayout
              ? context.fullLayout
              : context.state.activeLayout === "horizontal"
              ? context.horizontalLayout
              : context.VerticalLayout;

            if (documentTitle) document.title = documentTitle;
            return (
              <LayoutTag {...props}>
                <Suspense fallback={<Spinner />}>
                  {!fullLayout && (
                    <AppBreadCrumb
                      breadCrumbTitle={breadCrumb.breadCrumbTitle}
                      breadCrumbItems={breadCrumb.breadCrumbItems}
                    />
                  )}
                  <Component {...props} />
                </Suspense>
              </LayoutTag>
            );
          }}
        </ContextLayout.Consumer>
      )}
    />
  );
};

const AppRoute = RouteConfig;

const AppRouter = () => (
  <Router history={history}>
    <ScrollToTop />
    <Switch>
      {/* -------- Home --------*/}
      <AppRoute exact path="/" component={R.Home} documentTitle="Home" />

      {/* -------- Profile --------*/}
      <AppRoute path="/profile/edit-profile" component={R.editProfile} />
      <AppRoute path="/profile/change-password" component={R.ChangePassword} />
      <AppRoute path="/profile/edit-timezone" component={R.editTimezone} />

      {/* -------- Auths --------*/}
      <AppRoute
        path="/forget-password"
        component={R.ForgetPassword}
        fullLayout
        documentTitle="Forget Password"
      />
      <AppRoute
        path="/reset-password"
        component={R.resetPassword}
        fullLayout
        documentTitle="Reset Password"
      />
      <AppRoute
        path="/set-password"
        component={R.SetPassword}
        fullLayout
        documentTitle="Set Password"
      />
      <AppRoute path="/pages/login" component={R.login} fullLayout documentTitle="Login" />

      {/* -------- Users --------*/}
      <AppRoute path="/users/edit-user/:id" component={R.editUser} />
      <AppRoute path="/users/create-user" component={R.createUser} />
      <AppRoute path="/users" component={R.users} />

      {/* -------- Roles --------*/}
      <AppRoute path="/roles/edit-role/:id" component={R.editRole} />
      <AppRoute path="/roles/create-role" component={R.createRole} />
      <AppRoute path="/roles" component={R.RolesList} />

      {/* -------- Settings / Ecommerce --------*/}
      <AppRoute
        path="/settings/ecommerce-channels/shipping-countries-cities/:shippingMethodId/:saleChannelId"
        component={R.ShippingCountriesAndCities}
      />
      <AppRoute
        path="/settings/ecommerce-channels/channel-integration/:id"
        component={R.singleChannel}
      />
      <AppRoute path="/settings/ecommerce-channels" component={R.ecommerceChannels} />

      {/* -------- Settings / Shipping / Shipping Methods --------*/}
      <AppRoute
        path="/settings/shipping-methods/aramex-integration"
        component={R.aramexIntegration}
      />
      <AppRoute
        path="/settings/shipping-methods/ay-makan-integration"
        component={R.ayMakanIntegration}
      />
      <AppRoute path="/settings/shipping-methods/barq" component={R.BarqFleet} />

      {/* -------- Settings / Shipping  --------*/}
      <AppRoute
        path="/settings/shipping-methods"
        component={R.shippingMethods}
        breadCrumbTitle="Shipping methods"
      />

      {/* -------- Settings / Catalog Lang --------*/}
      <AppRoute path="/settings/default-language" component={R.defaultLanguage} />

      {/* ----- Catalog -------- */}
      <AppRoute path="/catalog/categories" component={R.categoriesListTree} />
      <AppRoute path="/catalog/attributes/attribute-details/:id" component={R.attributeDetails} />
      <AppRoute path="/catalog/attributes" component={R.attributes} />
      <AppRoute path="/catalog/products/product-details/:id" component={R.productDetails} />
      <AppRoute path="/catalog/products" component={R.products} />

      {/* -------- Settings / POS --------*/}
      <AppRoute path="/settings/pos/generate-key/:posId/:integration" component={R.GenerateAxKey} />
      <AppRoute path="/settings/pos" component={R.PostIntegrationList} />

      {/* -------- Hubs --------*/}
      <AppRoute path="/hubs/sort-locations/:id/:name" component={R.SortLocations} />

      <AppRoute path="/hubs/locations/:id/:name" component={R.LocationsList} />

      <AppRoute path="/hubs/create-hub" component={R.CreateHub} />
      <AppRoute path="/hubs/edit-hub/:id" component={R.editHub} />
      <AppRoute path="/hubs/settings/:id/:default_buffer/:name" component={R.hubSettingTab} />
      <AppRoute path="/hubs" component={R.HubsList} />

      {/* ----- Inventory -------- */}
      <AppRoute
        path="/inventory/total-inventory"
        component={R.totalInventory}
        breadCrumbTitle="Total Inventory"
      />
      <AppRoute
        path="/inventory/inventory-by-location/:productId/:hubId/:hubName"
        component={R.locationInventory}
      />
      <AppRoute path="/inventory/inventory-by-location" component={R.locationInventory} />

      <AppRoute path="/inventory/inventory-by-hub/:productId" component={R.hubInventory} />
      <AppRoute path="/inventory/inventory-by-hub" component={R.hubInventory} />

      <AppRoute path="/inventory/move-inventory" component={R.moveInventory} />
      <AppRoute path="/inventory/add-quantity" component={R.addQuantity} />

      <AppRoute
        path="/inventory/audit/edit-quantity/:productId/:hubLocationId/:quantity/:locationName/:productName"
        component={R.auditEditQuantities}
      />
      <AppRoute path="/inventory/audit" component={R.auditLocationsQuantityList} />

      <AppRoute
        path="/inventory/products-buffer/update/:productId/:hubId/:productName"
        component={R.UpdateProductBuffer}
      />
      <AppRoute path="/inventory/products-buffer" component={R.ProductsBufferList} />

      <AppRoute path="/inventory/importing" component={R.importing} />
      <AppRoute path="/inventory/sold-quantity-locations" component={R.soldQuantityLocations} />
      <AppRoute path="/inventory/refund-quantity-locations" component={R.refundQuantityLocations} />
      {/* -------- Sales --------*/}
      <AppRoute path="/sales/online-orders/manual-resolve" component={R.ManualResolve} />
      <AppRoute path="/sales/online-orders/:id" component={R.onlineOrderDetails} />
      <AppRoute path="/sales/online-orders" component={R.onlineOrders} />
      <AppRoute path="/sales/offline-orders" component={R.OfflineOrders} />

      {/* -------- Fulfillment / Carts --------*/}
      <AppRoute path="/fulfillment/carts/edit/:id" component={R.editCart} />
      <AppRoute path="/fulfillment/carts/create" component={R.createCarts} />
      <AppRoute path="/fulfillment/carts/details/:id" component={R.cartDetails} />
      <AppRoute path="/fulfillment/carts" component={R.cartsList} />

      {/* -------- Fulfillment / Stations --------*/}
      <AppRoute
        path="/fulfillment/dispatching-list/edit/:id"
        component={R.editDispatchingStation}
      />
      <AppRoute
        path="/fulfillment/dispatching-list/create"
        component={R.createDispatchingStation}
      />
      <AppRoute path="/fulfillment/dispatching-list" component={R.stationsList} />

      {/*  Dispatching / Dispatch Orders */}
      <AppRoute
        path="/dispatching/dispatch-orders/station-carts/station-cart-details/dispatch-order/shipping"
        component={R.shipping}
      />

      <AppRoute
        path="/dispatching/dispatch-orders/station-carts/station-cart-details/dispatch-order"
        component={R.dispatchOrder}
      />

      <AppRoute
        path="/dispatching/dispatch-orders/station-carts/station-cart-details"
        component={R.stationCartDetails}
      />

      <AppRoute path="/dispatching/dispatch-orders/station-carts" component={R.StationCartsList} />
      <AppRoute path="/dispatching/dispatch-orders" component={R.dispatchOrdersList} />

      {/*  Dispatching / Update Shipment */}
      <AppRoute path="/dispatching/update-shipment" component={R.UpdateShipment} />

      {/* -------- Redirections --------*/}
      <AppRoute
        path="/misc/not-authorized"
        component={R.authorized}
        fullLayout
        documentTitle="Not Authorized"
      />
      <AppRoute
        path="/misc/error/500"
        component={R.error500}
        fullLayout
        documentTitle="Server Error"
      />
      <AppRoute
        path="/misc/error/workspace-not-found"
        component={R.WorkSpaceNotFound}
        fullLayout
        documentTitle="workspace does not exist"
      />
      <AppRoute
        path="/misc/error/wrong-url"
        component={R.WrongURL}
        fullLayout
        documentTitle="Wrong URL"
      />
      <AppRoute path="/misc/error/404" component={R.error404} fullLayout documentTitle="404" />
      <AppRoute component={R.error404} fullLayout documentTitle="404" />
    </Switch>
  </Router>
);

export default AppRouter;
