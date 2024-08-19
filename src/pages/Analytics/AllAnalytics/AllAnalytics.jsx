import VendorAnalytics from "../VendorAnalytics/VendorAnalytics";
import CategoryAnalytics from "../CategoryAnalytics/CategoryAnalytics";
import ProductAnalytics from "../ProductAnalytics/ProductAnalytics";
function AllAnalytics() {
  return (
    <div>
      <VendorAnalytics />
      <CategoryAnalytics />
      <ProductAnalytics />
    </div>
  );
}

export default AllAnalytics;
