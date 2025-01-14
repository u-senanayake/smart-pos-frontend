export const styles = {
    mainContainer: {
        padding: "20px",
        marginTop: "80px",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
    },
    addButton: {
        marginBottom: "20px",
    },
    tableHeaderCell: {
        fontWeight: "bold",
        cursor: "pointer",
        backgroundColor: "#878c88",
        textAlign:"center",
    },
    zebraStripe: (index) => ({
        backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
    }),
    tableCell: {
        padding: "6px 14px",
    },
    actionSelect:{
        padding:"0px"
    },
    pagination: {
        marginTop: "20px",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "center",
    },
    filterDropdown: {

    },
    titleContainer: {
        //position: "fixed"
    },
    filterContainer: {
        display: "flex",
        gap: "20px",
        marginBottom: "20px",
        alignItems: "center",
        //position: "fixed"
    },
    filterFormController: {
        minWidth: 220,
        margin: "10px",
        height: "56px",
    },
    filterButton: {
        margin: "10px",
        height: "56px",
    },
    filterTitle: {
        textAlign: "left",
        //marginBottom: "20px",
    },
};