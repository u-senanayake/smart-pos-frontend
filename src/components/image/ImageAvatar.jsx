import { Avatar } from "@mui/material";
import * as APP_PROPERTY from '../../utils/const/AppProperty';

const getImageUrl = (type, typeId, imageId) => {
  return `${APP_PROPERTY.FILE_SERVER_URL}${type}/${typeId}/${imageId}`;
};

export const ImageAvatar = ({ type, typeId, imageId }) => {
  const imageUrl = getImageUrl(type, typeId, imageId);
  return (
    <Avatar
      alt="Distributor"
      src={imageId === null ? undefined : imageUrl}
      sx={{ width: 100, height: 100 }}
    />
  );
};

export const IconAvatar = ({ type, typeId, imageId }) => {
  const imageUrl = getImageUrl(type, typeId, imageId);
  return (

    <Avatar
      alt={"Distributor"}
      src={imageUrl}
      sx={{ width: 32, height: 32 }}
    />
  );
};
