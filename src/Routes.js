import { lazy } from "react";
import { retry } from "./utility/retry";

// Home
export const Home = lazy(() => retry(() => import("./views/pages/Home.jsx")));

// Auths
export const login = lazy(() =>
  retry(() => import("./views/pages/authentication/login/Login.jsx")),
);
export const ForgetPassword = lazy(() =>
  retry(() => import("./views/pages/ForgetPassword/ForgetPassword.jsx")),
);
export const SetPassword = lazy(() =>
  retry(() => import("./views/pages/set-password/SetPassword.jsx")),
);
export const resetPassword = lazy(() =>
  retry(() => import("./views/pages/reset-password/ResetPassword.jsx")),
);
export const ChangePassword = lazy(() =>
  retry(() => import("./views/pages/changePassword/ChangePassword.jsx")),
);

// Profile
export const editProfile = lazy(() => retry(() => import("./views/pages/profile/editProfile.jsx")));
export const editTimezone = lazy(() =>
  retry(() => import("./views/pages/profile/editTimezone.jsx")),
);

// Users
export const users = lazy(() => retry(() => import("./views/pages/users/usersList.jsx")));
export const createUser = lazy(() => retry(() => import("./views/pages/users/CreatUser.jsx")));
export const editUser = lazy(() => retry(() => import("./views/pages/users/EditUser")));

// Roles
export const RolesList = lazy(() => retry(() => import("./views/pages/roles/RolesList.jsx")));
export const createRole = lazy(() => retry(() => import("./views/pages/roles/createRole.jsx")));
export const editRole = lazy(() => retry(() => import("./views/pages/roles/editRole.jsx")));

// settings
export const singleChannel = lazy(() =>
  retry(() => import("./views/pages/settings/singleChannel")),
);

export const ecommerceChannels = lazy(() =>
  retry(() => import("./views/pages/settings/EcommerceChannels.jsx")),
);
export const defaultLanguage = lazy(() =>
  retry(() => import("./views/pages/settings/DefaultLanguage.jsx")),
);
export const shippingMethods = lazy(() =>
  retry(() => import("./views/pages/settings/ShippingMethods.jsx")),
);

export const aramexIntegration = lazy(() =>
  retry(() => import("./views/pages/settings/integrations/AramexIntegration")),
);
export const ayMakanIntegration = lazy(() =>
  retry(() => import("./views/pages/settings/integrations/ayMakanIntegration")),
);
export const BarqFleet = lazy(() =>
  retry(() => import("./views/pages/settings/integrations/BarqFleet")),
);

export const ShippingCountriesAndCities = lazy(() =>
  retry(() => import("./views/pages/settings/ShippingCountriesAndCities")),
);
export const PostIntegrationList = lazy(() =>
  retry(() => import("./views/pages/settings/POS/PosIntegrationList")),
);
export const GenerateAxKey = lazy(() =>
  retry(() => import("./views/pages/settings/POS/GenerateAxKey")),
);
// Hubs
export const HubsList = lazy(() => retry(() => import("./views/pages/hubs/hubsList")));
export const editHub = lazy(() => retry(() => import("./views/pages/hubs/editHub")));
export const CreateHub = lazy(() => retry(() => import("./views/pages/hubs/createHub")));
export const LocationsList = lazy(() =>
  retry(() => import("./views/pages/hubs/locations/locationsList")),
);
export const SortLocations = lazy(() =>
  retry(() => import("./views/pages/hubs/locations/SortLocations")),
);
export const hubSettingTab = lazy(() => retry(() => import("./views/pages/hubs/HubSettingTabs")));

// Catalog
export const categoriesListTree = lazy(() =>
  retry(() => import("./views/pages/catalog/CategoriesListTree.jsx")),
);
export const attributes = lazy(() => retry(() => import("./views/pages/catalog/AttributesList")));
export const products = lazy(() => retry(() => import("./views/pages/catalog/ProductsList")));
export const attributeDetails = lazy(() =>
  retry(() => import("./views/pages/catalog/AttributeDetails.jsx")),
);
export const productDetails = lazy(() =>
  retry(() => import("./views/pages/catalog/ProductDetails.jsx")),
);

// Inventory
export const totalInventory = lazy(() =>
  retry(() => import("./views/pages/inventory/TotalInventory")),
);
export const locationInventory = lazy(() =>
  retry(() => import("./views/pages/inventory/LocationInventory")),
);
export const hubInventory = lazy(() => retry(() => import("./views/pages/inventory/HubInventory")));
export const moveInventory = lazy(() =>
  retry(() => import("./views/pages/inventory/moveInventory.jsx")),
);
export const addQuantity = lazy(() => retry(() => import("./views/pages/inventory/AddQuantity")));
export const auditLocationsQuantityList = lazy(() =>
  retry(() => import("./views/pages/inventory/AuditLocationsQuantityList")),
);
export const auditEditQuantities = lazy(() =>
  retry(() => import("./views/pages/inventory/AuditEditQuantities")),
);
export const ProductsBufferList = lazy(() =>
  retry(() => import("./views/pages/inventory/ProductsBufferList")),
);
export const UpdateProductBuffer = lazy(() =>
  retry(() => import("./views/pages/inventory/UpdateProductBuffer")),
);
export const importing = lazy(() =>
  retry(() => import("./views/pages/inventory/importing/importing")),
);
export const soldQuantityLocations = lazy(() =>
  retry(() => import("./views/pages/inventory/SoldQuantityLocations")),
);
export const refundQuantityLocations = lazy(() =>
  retry(() => import("./views/pages/inventory/RefundQuantityLocations")),
);
// Sales
export const onlineOrders = lazy(() => retry(() => import("./views/pages/sales/OnlineOrders")));
export const OfflineOrders = lazy(() => retry(() => import("./views/pages/sales/OfflineOrders")));
export const ManualResolve = lazy(() => retry(() => import("./views/pages/sales/ManualResolve")));
export const onlineOrderDetails = lazy(() =>
  retry(() => import("./views/pages/sales/OnlineOrderDetails")),
);
// Carts
export const cartsList = lazy(() => retry(() => import("./views/pages/carts/CartsList")));
export const createCarts = lazy(() => retry(() => import("./views/pages/carts/createCarts")));
export const editCart = lazy(() => retry(() => import("./views/pages/carts/editCart")));
export const cartDetails = lazy(() => retry(() => import("./views/pages/carts/CartDetails")));

// Picking
export const stationsList = lazy(() =>
  retry(() => import("./views/pages/dispatchingStations/stationsList")),
);
export const createDispatchingStation = lazy(() =>
  retry(() => import("./views/pages/dispatchingStations/CreateDispatchingStation")),
);
export const editDispatchingStation = lazy(() =>
  retry(() => import("./views/pages/dispatchingStations/EditDispatchingStation")),
);
// Dispatching / Dispatch Order
export const dispatchOrder = lazy(() =>
  retry(() => import("./views/pages/dispatchOrders/DispatchOrder")),
);
export const dispatchOrdersList = lazy(() =>
  retry(() => import("./views/pages/dispatchOrders/dispatchOrdersList")),
);

export const StationCartsList = lazy(() =>
  retry(() => import("./views/pages/dispatchOrders/StationCartsList")),
);

export const stationCartDetails = lazy(() =>
  retry(() => import("./views/pages/dispatchOrders/stationCartDetails")),
);

export const shipping = lazy(() => retry(() => import("./views/pages/dispatchOrders/Shipping")));

// Dispatching / Update Shipment
export const UpdateShipment = lazy(() =>
  retry(() => import("./views/pages/UpdateShipment/UpdateShipment")),
);

// Redirections
export const authorized = lazy(() => retry(() => import("./views/pages/misc/NotAuthorized")));
export const error404 = lazy(() => retry(() => import("./views/pages/misc/error/404")));
export const error500 = lazy(() => retry(() => import("./views/pages/misc/error/500")));
export const WorkSpaceNotFound = lazy(() =>
  retry(() => import("./views/pages/misc/error/workspacerNotFound")),
);
export const WrongURL = lazy(() => retry(() => import("./views/pages/misc/error/WrongURL")));
