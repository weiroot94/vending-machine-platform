import {Hidden} from "@mui/material";
import {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import {useParams} from "react-router-dom";
import axios from "axios";
import appConfig from "app/configs/appConfig";
import { showMessage } from "app/store/fuse/messageSlice";
import ProductDetailContent from "./ProductDetailContent";
import ProductDetailMobileContent from "./ProductDetailMobileContent";

function ProductDetailPage(props) {
  const {id} = useParams();
  const [currentProduct, setCurrentProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .post(appConfig.API_SERVER + "customer/product/detail", {
        id: id,
      })
      .then((response) => {
        console.log(response.data.data);
        setCurrentProduct(response.data.data);
      }).catch((err) => {
        if (err.response && (err.response.status == 400 || err.response.status == 500)) {
          dispatch(
            showMessage({
                message: err.response.data.error,
                variant: 'error'
            }));
        } else {
          console.log(err);
          dispatch(
            showMessage({
                message: "Failed to sign up new user, please contact support team",
                variant: 'error'
            }));
        }
      });
    return () => {};
  }, []);

  return (
    currentProduct && (
      <>
        <Hidden lgDown>
          <div className="py-20 px-32 flex flex-col justify-center w-full">
            <ProductDetailContent Product={currentProduct} />
          </div>
        </Hidden>
        <Hidden lgUp>
          <div className="py-32 px-16 flex flex-col justify-center">
            <ProductDetailMobileContent Product={currentProduct} />
          </div>
        </Hidden>
      </>
    )
  );
}

export default ProductDetailPage;
