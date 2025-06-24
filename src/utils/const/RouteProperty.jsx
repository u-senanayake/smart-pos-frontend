//Home
export const ROOT = '/';
export const HOME = '/home';

//Login
export const LOGIN = '/login';

//Sales
export const SALES_POS = '/sales/pos';
export const SALES_POS_OPEN = '/sales/pos/:saleId';
export const SALES_DRAFTLIST = '/sales/draftslist';
export const SALES_HISTORY = '/sales/saleshistory';
export const SALES_RETURN = '/sales/salesreturn';
export const SALES_RETURN_LIST = '/sales/listreturn';

//Quotation
export const QUOTATION_LIST = '/quotation/quotationlist'; 
export const QUOTATION_CREATE = '/quotation/createquotation';

//Delivery
export const DELIVERY_SHIPMENTS = '/delivery/shipments';

//Purchase
export const PURCHASE_LIST = '/purchase/purchaselist';
export const PURCHASE_CREATE = '/purchase/createpurchase';
export const PURCHASE_VIEW = '/purchase/viewpurchase/:purchaseId';
export const PURCHASE_RETURN_LIST = '/purchase/purchasereturnslist';

//Expense
export const EXPENSE_LIST = '/expenses/expenselist';
export const EXPENSE_CREATE = '/expenses/createexpense';
export const EXPENSE_CATEGORY = '/expenses/expensecategory';

//Product
export const PRODUCT_LIST = '/product/productlist';
export const PRODUCT_CREATE = '/product/createproduct';
export const PRODUCT_UPDATE = '/product/updateproduct/:id';
export const PRODUCT_VIEW = '/product/viewproduct/:id';

//Category
export const CATEGORY_LIST = '/product/categorylist';  
export const CATEGORY_CREATE = '/product/category/createcategory';
export const CATEGORY_UPDATE = '/product/category/updatecategory/:categoryId';
export const CATEGORY_VIEW = '/product/category/viewcategory/:categoryId';

//Brand
export const BRAND_LIST = '/product/brandlist';
export const BRAND_CREATE = '/product/brand/createbrand';
export const BRAND_UPDATE = '/product/brand/updatebrand/:brandId';
export const BRAND_VIEW = '/product/brand/viewbrand/:brandId';

//Distributor
export const DISTRIBUTOR_LIST = '/product/distributorlist';
export const DISTRIBUTOR_CREATE = '/product/distributor/createdistributor';
export const DISTRIBUTOR_UPDATE = '/product/distributor/updatedistributor/:distributorId';
export const DISTRIBUTOR_VIEW = '/product/distributor/viewdistributor/:distributorId';

//Inventory
export const INVENTORY_LIST = '/inventory/inventorylist';

//Customer Groups
export const CST_GRP_LIST = '/customer/customergrouplist';
export const CST_GRP_CREATE = '/customer/customergroup/createcustomergroup';
export const CST_GRP_UPDATE = '/customer/customergroup/updatecustomergroup/:customerGroupId';
export const CST_GRP_VIEW = '/customer/customergroup/viewcustomergroup/:customerGroupId';

//Customer
export const CUSTOMER_LIST = '/customer/customerlist';
export const CUSTOMER_CREATE = '/customer/createcustomer';
export const CUSTOMER_UPDATE = '/customer/updatecustomer/:customerId';
export const CUSTOMER_VIEW = '/customer/viewcustomer/:customerId';

//User
export const USER_LIST = '/user/userlist';
export const USER_CREATE = '/user/createuser';
export const USER_UPDATE = '/user/updateuser/:userId';
export const USER_VIEW = '/user/viewuser/:userId';

//Role
export const ROLE_LIST = '/user/rolelist';
export const ROLE_CREATE = '/user/role/createrole';
export const ROLE_UPDATE = '/user/role/updaterole/:roleId';
export const ROLE_VIEW = '/user/role/viewrole/:roleId';
