import Echo from "laravel-echo";
import { can } from "../configs/casl/ability";
import { checkSyncCategories } from "../redux/catalog/categories/categoriesActions";
import { store } from "../redux/storeConfig/store";
import { syncPermissions } from "../redux/permissions/permissionsActions";
import { checkSyncAttributes } from "../redux/catalog/attributes/attributesActions";
import { checkSyncProducts } from "../redux/catalog/products/productsActions";
import { getDomain } from "../utility/commonFunctions";
import { syncTypes, duration } from "../utility/constants";
import { updateOccupation } from "../redux/picking/dispatchingOrders/dispatchingOrdersActions";
import { connectSocket } from "../redux/profile/profileActions";

const DOMAIN = getDomain();
export const initRealtime = () => {
  // eslint-disable-next-line no-console
  console.log("{{{===> Initing Realtime <===}}}");
  if (!window.io) {
    window.io = require("socket.io-client");
  }
  window.Echo = new Echo({
    broadcaster: "socket.io",
    host: process.env.REACT_APP_SOCKET_HOST,
    auth: {
      headers: {
        Accept: "application/json",
        "X-DOMAIN": getDomain(),
      },
    },
  });
  window.Echo.connector.socket.on("connect", () => {
    // eslint-disable-next-line no-console
    console.log("{{{{ SOCKET CONNECTED! (Socket ID)===>", window.Echo.socketId());
    store.dispatch(connectSocket());
  });

  window.Echo.connector.socket.on("disconnect", () => {
    // eslint-disable-next-line no-console
    console.log("SOCKET DISCONNECTED!");
  });
};

export const listenSyncChannel = () => {
  const CHANNEL_NAME = `${DOMAIN}.sync`;
  // eslint-disable-next-line no-console
  console.log("{{ INITIAL }} Listening Sync.....");
  window.Echo.leave(CHANNEL_NAME);
  window.Echo.channel(CHANNEL_NAME).listen(".sync.updated", (data) => {
    switch (data.type.value) {
      case syncTypes.CATEGORIES:
        // eslint-disable-next-line no-console
        console.log("categories Changed~", data.type);
        store.dispatch(checkSyncCategories(can("view", "categories"), "viewToaster"));
        break;
      case syncTypes.PRODUCTS:
        // eslint-disable-next-line no-console
        console.log("products Changed~", data.type);
        store.dispatch(checkSyncProducts(can("view", "products"), "viewToaster"));
        break;
      case syncTypes.ATTRIBUTES:
        // eslint-disable-next-line no-console
        console.log("attributes Changed~", data.type);
        store.dispatch(checkSyncAttributes(can("view", "attributes"), "viewToaster"));
        break;
      default:
        break;
    }
  });
  setInterval(() => {
    // eslint-disable-next-line no-console
    console.log("((INTERVAL)) Listening Sync.....");
    window.Echo.leave(CHANNEL_NAME);
    window.Echo.channel(CHANNEL_NAME).listen(".sync.updated", (data) => {
      switch (data.type.value) {
        case syncTypes.CATEGORIES:
          // eslint-disable-next-line no-console
          console.log("categories Changed~", data.type);
          store.dispatch(checkSyncCategories(can("view", "categories"), "viewToaster"));
          break;
        case syncTypes.PRODUCTS:
          // eslint-disable-next-line no-console
          console.log("products Changed~", data.type);
          store.dispatch(checkSyncProducts(can("view", "products"), "viewToaster"));
          break;
        case syncTypes.ATTRIBUTES:
          // eslint-disable-next-line no-console
          console.log("attributes Changed~", data.type);
          store.dispatch(checkSyncAttributes(can("view", "attributes"), "viewToaster"));
          break;
        default:
          break;
      }
    });
  }, duration.minute * 5);
};

export const listenUserChanges = (userId) => {
  const CHANNEL_NAME = `${DOMAIN}.user_changes.${userId}`;
  // eslint-disable-next-line no-console
  console.log("{{ INITIAL }} Listening User Permissions ...");
  window.Echo.leave(CHANNEL_NAME);
  window.Echo.channel(CHANNEL_NAME).listen(".tenant.user.updated", (data) => {
    // eslint-disable-next-line no-console
    console.log("USER CHANGED~", data);
    store.dispatch(syncPermissions(!"No Auth", "Manual Sync"));
  });
  setInterval(() => {
    // eslint-disable-next-line no-console
    console.log("((INTERVAL)) Listening User Permissions...");
    window.Echo.leave(CHANNEL_NAME);
    window.Echo.channel(CHANNEL_NAME).listen(".tenant.user.updated", (data) => {
      // eslint-disable-next-line no-console
      console.log("USER CHANGED~", data);
      store.dispatch(syncPermissions(!"No Auth", "Manual Sync"));
    });
  }, duration.minute * 5);
};

export const listenUserDeletion = (userId) => {
  const CHANNEL_NAME = `${DOMAIN}.user_deleted.${userId}`;
  // eslint-disable-next-line no-console
  console.log("{{ INITIAL }} Listening User Deletion ...");
  window.Echo.channel(CHANNEL_NAME).listen(".tenant.user.deleted", (data) => {
    // eslint-disable-next-line no-console
    console.log("USER DELETED!!~", data);
    store.dispatch(syncPermissions(!"No Auth", "Manual Sync"));
  });

  setInterval(() => {
    // eslint-disable-next-line no-console
    console.log("((INTERVAL)) Listening User Deletion ...");
    window.Echo.leave(CHANNEL_NAME);
    window.Echo.channel(CHANNEL_NAME).listen(".tenant.user.deleted", (data) => {
      // eslint-disable-next-line no-console
      console.log("INTERVAL USER DELETED!!~", data);
      store.dispatch(syncPermissions(!"No Auth", "Manual Sync"));
    });
  }, duration.minute * 5);
};

export const listenDispatcherOccupation = (hubId) => {
  const CHANNEL_NAME = `${DOMAIN}.hub_dispatching_stations.${hubId}`;
  // eslint-disable-next-line no-console
  console.log("{{ INITIAL }} Listening Dispatcher Occupation ...");
  window.Echo.leave(CHANNEL_NAME);
  window.Echo.channel(CHANNEL_NAME).listen(
    ".dispatcher.dispatching_station_occupation.updated",
    (data) => {
      // eslint-disable-next-line no-console
      console.log("Dispatcher Occupation Changed!~", data);
      store.dispatch(updateOccupation(data));
    },
  );
  setInterval(() => {
    // eslint-disable-next-line no-console
    console.log("((INTERVAL)) Listening Dispatcher Occupation ...");
    window.Echo.leave(CHANNEL_NAME);
    window.Echo.channel(CHANNEL_NAME).listen(
      ".dispatcher.dispatching_station_occupation.updated",
      (data) => {
        // eslint-disable-next-line no-console
        console.log("Dispatcher Occupation Changed!~");
        store.dispatch(updateOccupation(data));
      },
    );
  }, duration.minute * 5);
};

export const leaveDispatcherOccupation = (hubId) => {
  const CHANNEL_NAME = `${DOMAIN}.hub_dispatching_stations.${hubId}`;
  // eslint-disable-next-line no-console
  console.log("Leaving Dispatcher Occupation ...");
  window.Echo.channel(CHANNEL_NAME).stopListening(
    ".dispatcher.dispatching_station_occupation.updated",
    (data) => {
      // eslint-disable-next-line no-console
      console.log("Dispatcher Occupation Leaved!~", data);
    },
  );
};
