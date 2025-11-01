import {Hidden} from "@mui/material";
import HomeContent from "./HomeContent";
import HomeMobileContent from "./HomeMobileContent";
import appConfig from "app/configs/appConfig";
import {useState, useEffect} from "react";
import axios from "axios";

function HomePage(props) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    axios
      .post(appConfig.API_SERVER + "customer/product/home/list")
      .then((res) => {
        setPopularProducts(res.data.detail.popular);
        setFeaturedProducts(res.data.detail.featured);
        setLoaded(true);
      });
    return () => {};
  }, []);

  return (
    isLoaded == true &&
    popularProducts != [] &&
    featuredProducts != [] && (
      <>
        <Hidden lgDown>
          <div
            className="py-20"
            style={{paddingLeft: "100px", paddingRight: "100px"}}
          >
            <HomeContent
              FeaturedProduct={featuredProducts}
              PopularProduct={popularProducts}
            />
          </div>
        </Hidden>
        <Hidden lgUp>
          <div
            className="py-32"
            style={{paddingLeft: "20px", paddingRight: "20px"}}
          >
            <HomeMobileContent
              FeaturedProduct={featuredProducts}
              PopularProduct={popularProducts}
            />
          </div>
        </Hidden>
      </>
    )
  );
}

export default HomePage;
