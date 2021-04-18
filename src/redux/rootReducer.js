import { combineReducers } from "redux";
import customizer from "./customizer";
import authReducer from "./Auth/AuthReducer";
import errorsReducer from "./serverErrors/serverErrorsReducer";
import loadersReducer from "./loaders/loadersReducer";
import profileReducer from "./profile/profileReducer";
import rolesReducer from "./roles/rolesReducer";
import userReducer from "./users/usersReducer";
import ecommerceReducer from "./ecommerce-channels/ecommerceReducer";
import settingsReducer from "./settings/settingsReducer";
import categoriesReducer from "./catalog/categories/categoriesReducer";
import attributesReducer from "./catalog/attributes/attributesReducer";
import lazyAlertReducer from "./lazyAlert/lazyAlertReducer";
import productsReducer from "./catalog/products/productsReducer";
import permissionsReducer from "./permissions/permissionsReducer";
import hubsReducer from "./hubs/hubsReducer";
import locationsReducer from "./hubs/locations/locationsReducer";
import totalInventoryReducer from "./inventory/totalInventory/totalInvetoryReducer";
import InventoryWithHubsLocationsReducer from "./inventory/inventoryWithHubsLocations/inventoryWithHubsLocationsReducer";
import InventoryWithHubsReducer from "./inventory/inventoryWithHubs/inventoryWithHubsReducer";
import movingReducer from "./inventory/moving/movingReducer";
import productBufferReducer from "./inventory/productBuffer/productBufferReducer";
import ordersReducer from "./orders/ordersReducer";
import importingReducer from "./inventory/importing/importingReducer";
import cartsReducer from "./picking/carts/cartsReducer";
import dispatchingStationsReducer from "./picking/dispatchingStations/dispatchingStationsReducer";
import shippingReducer from "./shipping/shippingReducer";
import dispatchingOrdersReducer from "./picking/dispatchingOrders/dispatchingOrdersReducer";
import pickerReducer from "./picking/picker/pickerReducer";
import createShippmentReducer from "./create-shippment/createShippmentReducer";
import breadCrumbReducer from "./BreadCrumb/BreadCrumbReducer";
import posReducer from './pos-offline-orders/posReducer'

const rootReducer = combineReducers({
  customizer,
  auth: authReducer,
  breadCrumb: breadCrumbReducer,
  serverErrors: errorsReducer,
  loaders: loadersReducer,
  profile: profileReducer,
  roles: rolesReducer,
  users: userReducer,
  salesChannels: ecommerceReducer,
  settings: settingsReducer,
  categories: categoriesReducer,
  attributes: attributesReducer,
  products: productsReducer,
  lazyAlert: lazyAlertReducer,
  permissions: permissionsReducer,
  hubs: hubsReducer,
  locations: locationsReducer,
  totalInventory: totalInventoryReducer,
  InventoryWithHubsLocations: InventoryWithHubsLocationsReducer,
  InventoryWithHubs: InventoryWithHubsReducer,
  moving: movingReducer,
  productBuffer: productBufferReducer,
  orders: ordersReducer,
  importing: importingReducer,
  carts: cartsReducer,
  dispatchingStations: dispatchingStationsReducer,
  shipping: shippingReducer,
  dispatchingOrders: dispatchingOrdersReducer,
  picker: pickerReducer,
  createShippment: createShippmentReducer,
  pos:posReducer
});

export default rootReducer;
