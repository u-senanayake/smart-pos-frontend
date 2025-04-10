import { CircularProgress, Skeleton, } from "@mui/material";

export const Loading = () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
    </div>
);

export const SkeletonLoading = () => (
    <div style={{ padding: "20px" }}>
        {[...Array(5)].map((_, index) => (
            <Skeleton key={index} height={40} style={{ marginBottom: "10px" }} />
        ))}
    </div>
);