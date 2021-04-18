import React, { useEffect, Suspense } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Router from "./Router";
import "react-toastify/dist/ReactToastify.css";
import { AbilityContext } from "./configs/casl/can";
import "./assets/scss/plugins/extensions/toastr.scss";
import ability, { can } from "./configs/casl/ability";
import LazyAlert from "./components/shared/LazyAlert";
import "./components/@vuexy/rippleButton/RippleButton";
import { checkSyncProducts } from "./redux/catalog/products/productsActions";
import { redirectUnauthUser } from "./utility/commonFunctions";
import { checkSyncAttributes } from "./redux/catalog/attributes/attributesActions";
import { checkSyncCategories } from "./redux/catalog/categories/categoriesActions";
import {
  listenUserChanges,
  listenSyncChannel,
  listenUserDeletion,
  initRealtime,
} from "./network/realTime";
import { viewProfile } from "./redux/profile/profileActions";
import SpinnerComponent from "./components/@vuexy/spinner/Fallback-spinner";

/**
 * App Component
 */
const App = () => {
  const dispatch = useDispatch();
  const { lazyAlert, permissions, profile, auth } = useSelector((state) => state);

  // redirect unauth user
  useEffect(() => {
    redirectUnauthUser();
    if (auth.email) {
      dispatch(viewProfile());
    }
  }, [auth.email]);

  useEffect(() => {
    if (profile.is_super && profile.isSocketConnected) {
      dispatch(checkSyncAttributes());
      dispatch(checkSyncCategories());
      dispatch(checkSyncProducts());
    }
  }, [profile.is_super, profile.isSocketConnected]);

  // init listen syncing on login and refresh
  useEffect(() => {
    if (profile.roles && profile.isSocketConnected) {
      const pers = [];
      profile.roles.forEach((role) => {
        role.permissions.forEach((per) => {
          pers.push(per.tag);
        });
      });
      if (pers.includes("view_attributes")) dispatch(checkSyncAttributes());
      if (pers.includes("view_categories")) dispatch(checkSyncCategories());
      if (pers.includes("view_product")) dispatch(checkSyncProducts());
    }
  }, [profile.roles]);

  // listening realtime
  useEffect(() => {
    if (profile?.id) {
      initRealtime();
    }
  }, [profile?.id]);

  useEffect(() => {
    if (profile.isSocketConnected && profile) {
      listenUserChanges(profile.id);
      listenUserDeletion(profile.id);
    }
  }, [profile.isSocketConnected]);

  useEffect(() => {
    if (
      profile.isSocketConnected &&
      (can("view", "products") || can("view", "categories") || can("view", "attributes"))
    ) {
      // Listen on Syncing
      listenSyncChannel();
    }
  }, [permissions, profile]);

  return (
    <Suspense fallback={<SpinnerComponent />}>
      <div data-test="component-app">
        <AbilityContext.Provider value={ability}>
          <Router />
        </AbilityContext.Provider>

        {/* Toasters */}
        <ToastContainer hideProgressBar />

        {/* Global Lazy Alert */}
        <LazyAlert
          show={lazyAlert.show}
          message={lazyAlert.message}
          btnColor={lazyAlert.btnColor}
          confirmBtnColor={lazyAlert.confirmBtnColor}
          cancelBtnColor={lazyAlert.cancelBtnColor}
          onConfirm={lazyAlert.onConfirm}
          onCancel={lazyAlert.onCancel}
          loader={lazyAlert.loader}
          iconType={lazyAlert.iconType}
          confirmLabel={lazyAlert.confirmLabel}
          cancelLabel={lazyAlert.cancelLabel}
        />
      </div>
    </Suspense>
  );
};

export default App;
