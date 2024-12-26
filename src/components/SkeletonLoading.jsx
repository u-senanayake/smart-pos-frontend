import { Skeleton } from "@mui/material";

const RoleSkeleton = () => (
  <div style={{ padding: "20px" }}>
    {[...Array(5)].map((_, index) => (
      <Skeleton key={index} height={40} style={{ marginBottom: "10px" }} />
    ))}
  </div>
);
export default RoleSkeleton;