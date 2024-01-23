import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { Delete, Image, PictureAsPdf } from "@mui/icons-material";
import { baseUrl } from "../../constants/url.constants";
import "./products-grid.scss";
import ConfirmationDialog from "../../constants/ConfirmationDialog";
import { IProduct } from "../../types/global.typing";
import Tooltip from "@mui/material/Tooltip";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { GridCellParams } from "@mui/x-data-grid";

const useTooltip = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return { isTooltipOpen, setIsTooltipOpen };
};
const DownloadImageTooltip = (params: GridCellParams) => {
  const { isTooltipOpen, setIsTooltipOpen } = useTooltip();

  const isImage = params.row.imageUrl.match(/\.(jpg|jpeg|png)$/i);

  return (
    <div className="action-link-container">
      <Tooltip
        open={isTooltipOpen}
        onClose={() => setIsTooltipOpen(false)}
        onOpen={() => setIsTooltipOpen(true)}
        title={
          <div style={{ width: "250px", height: "300px" }}>
            {isImage ? (
              <img
                src={`${baseUrl}/Product/download/${params.row.imageUrl}`}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <p>File type not supported for preview</p>
            )}
          </div>
        }
        arrow
      >
        <a
          href={`${baseUrl}/Product/download/${params.row.imageUrl}`}
          download
          className="action-link"
        >
          {isImage ? (
            <Image
              style={{
                justifyContent: "center",
                marginLeft: "3rem",
                color: "darkred",
              }}
            />
          ) : (
            <PictureAsPdf
              style={{ width: "24px", height: "24px", marginLeft: "3rem" }}
            />
          )}
        </a>
      </Tooltip>
    </div>
  );
};

const column: GridColDef[] = [
  { field: "serialNumber", headerName: "S. N.", width: 66 },
  { field: "id", headerName: "ID", width: 66 },
  { field: "productName", headerName: "Product Name", width: 150 },
  {
    field: "download",
    headerName: "Preview Image",
    width: 175,
    renderCell: DownloadImageTooltip,
  },
  { field: "productDescription", headerName: "Description", width: 250 },
  { field: "productSize", headerName: "Product Size", width: 150 },
  { field: "markedPrice", headerName: "Marked Price", width: 110 },
  { field: "costPrice", headerName: "Cost Price", width: 110 },
  { field: "wholeSalePrice", headerName: "Wholesale Price", width: 150 },
  {
    field: "retailPrice",
    headerName: "Retail Price",
    width: 110,
  },
  { field: "categoryName", headerName: "Category Name", width: 150 },
  { field: "companyName", headerName: "Company Name", width: 250 },
  /*
  {
    field: "createdAtFromNow",
    headerName: "Created",
    width: 150,
    renderCell: (params) => moment(params.row.createdAt).fromNow(),
  },
  */

  {
    field: "actions",
    headerName: "Actions",
    width: 300,
    headerAlign: "center",
    renderCell: (params) => (
      <div style={{ marginLeft: "3.5rem" }}>
        <Link
          to={`/products/update/${params.row.id}`}
          className="action-link"
          style={{ fontSize: "1rem" }}
        >
          Edit
        </Link>
        <span
          style={{
            margin: "0 8px",
            color: "var(--text-color1)",
            borderLeft: "2px solid var(--text-color1)",
            height: "60px",
          }}
        ></span>
        <Button
          className="delete-button"
          onClick={() => params.row.onDelete(params.row)}
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            color: params.row.darkMode ? "#f7f5e6" : "#333a56",
          }}
          startIcon={<Delete />}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

interface IProductsGridProps {
  data: IProduct[];
  onDelete: (product: IProduct) => void;
  darkMode: boolean;
}

const ProductsGrid = ({ data, onDelete, darkMode }: IProductsGridProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

  const handleDeleteClick = (product: IProduct) => {
    setProductToDelete(product);
    setOpenDeleteDialog(true);
  };

  return (
    <div className="products-grid" style={{ height: "555px", width: "100%" }}>
      <DataGrid
        rows={data.map((product, index) => ({
          serialNumber: index + 1,
          ...product,
          onDelete: handleDeleteClick,
          darkMode: darkMode,
        }))}
        columns={column}
        getRowId={(row) => row.id}
        rowHeight={45}
      />

      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={() => {
          if (productToDelete) {
            onDelete(productToDelete);
            setOpenDeleteDialog(false);
          }
        }}
      />
    </div>
  );
};

export default ProductsGrid;
