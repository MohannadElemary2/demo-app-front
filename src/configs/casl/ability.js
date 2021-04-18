import { Ability, AbilityBuilder } from "@casl/ability";
import { store } from "../../redux/storeConfig/store";

const ability = new Ability();

let currentAuth;
store.subscribe(() => {
  const prevAuth = currentAuth;
  currentAuth = store.getState().permissions;
  if (prevAuth !== currentAuth) {
    ability.update(defineRulesFor(currentAuth));
  }
});

export const manualUpdate = (auth) => {
  // eslint-disable-next-line no-console
  console.log("Manual Update Permissions on Ability File .....");
  ability.update(defineRulesFor(auth));
};

export const defineRulesFor = (auth) => {
  const pers = [];
  // if the user is not a super admin
  if (auth && auth.is_super === 0) {
    auth.roles.forEach((role) => {
      role.permissions.forEach((per) => {
        pers.push(per.tag);
      });
    });
  } else if (auth && Boolean(auth.is_super)) {
    pers.push("manage_all");
  }

  const { can, rules } = new AbilityBuilder();
  // splitting tags coming from server to permissions
  pers.forEach((p) => {
    const [action, subject] = p.split("_");
    can(action, subject);
    can("viewPage", "home");
    // adding role viewPage if user have any role of a specific module
    can("viewPage", subject);
    // for inventory user have to see all pages
    if (subject === "inventory") {
      can("viewPage", "totalinventory");
      can("viewPage", "inventory-by-hub");
      can("viewPage", "locationinventory");
    }
    // if the user has any `*_hubLocations` permission, can view `Hubs` Page
    if (subject === "hubLocations") {
      can("viewPage", "hubs");
    }
    // if the user has `view_carts` permission, can view `cartsList` page
    if (action === "view" && subject === "carts") {
      can("viewPage", "cartsList");
    }

    // if the user has `viewShippingMethods` permission, can view `shippingMethods` page
    if (action === "viewShippingMethods") {
      can("viewPage", "shippingMethods");
    }
    // if the user has `manageQuantities_inventory` permission, can view `Add Quantity` page
    if (action === "manageQuantities") {
      can("viewPage", "addQuantity");
    }
    //  If the use `moveQuantities_inventory` permission, can view the `Moving` page
    if (action === "moveQuantities") {
      can("viewPage", "moveInventory");
      can("viewPage", "soldQuantityLocations");
      can("viewPage", "refundQuantityLocations");
    }

    // if the user has `viewProductsBuffer_hubs` permission, can view the `Products Buffer` page
    if (action === "viewProductsBuffer") {
      can("viewPage", "productsBuffer");
    }

    // if the user has `manageInventoryAsAudit_audit` permission, can view the `Importing` page
    if (
      (action === "manageInventoryAsAudit" && subject === "audit") ||
      (action === "importProductsBuffer" && subject === "inventory")
    ) {
      can("viewPage", "importing");
    }

    // if the user has `manageInventoryAsAudit_audit` permission, can view the `soldQuantityLocations` page
    if (action === "manageInventoryAsAudit" && subject === "audit") {
      can("viewPage", "soldQuantityLocations");
      can("viewPage", "refundQuantityLocations");
    }
    // if the user has `viewOnline_orders` permission, can view the `Online Order` page
    if (action === "viewOnline") {
      can("viewPage", "onlineOrders");
    }
    // if the user has `viewOffline_orders` permission, can view the `Online Order` page
    if (action === "viewOffline") {
      can("viewPage", "offlineOrders");
    }
    // if the user has `dispatcher_dispatching` permission, can view the `Update Shipment` page
    if (action === "dispatcher" && subject === "dispatching") {
      can("viewPage", "updateShipment");
    }

    // if the user has `editLocale_settings` permission, can view the `editLocale` page
    if (action === "editLocale" && subject === "settings") {
      can("viewPage", "editLocale");
    }
    // if the user has `viewPosIntegrations_settings` permission, can view the `editLocale` page
    if (action === "viewPosIntegrations" && subject === "settings") {
      can("viewPage", "posIntegrations");
    }
  });

  console.log({ rules });
  return rules;
};

export const can = (action, subject) => ability.can(action, subject);

export default ability;
