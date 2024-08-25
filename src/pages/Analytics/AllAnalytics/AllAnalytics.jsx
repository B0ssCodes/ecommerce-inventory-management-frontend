import VendorAnalytics from "../VendorAnalytics/VendorAnalytics";
import CategoryAnalytics from "../CategoryAnalytics/CategoryAnalytics";
import ProductAnalytics from "../ProductAnalytics/ProductAnalytics";
import TransactionCount from "../TransactionCount/TransactionCount";
function AllAnalytics() {
  return (
    <div>
      <TransactionCount />
      <VendorAnalytics displayAll={false} />
      <CategoryAnalytics displayAll={false} />
      <ProductAnalytics displayAll={false} />
    </div>
  );
}

export default AllAnalytics;
