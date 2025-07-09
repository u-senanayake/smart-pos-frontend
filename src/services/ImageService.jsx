import axios from 'axios';

const API_URL = '/api/v1/image';


class ImageService {

    // Upload an image
    async uploadImage(formData, imgType, typeId) {
        const response = await axios.post(
            `${API_URL}/upload` + `?imgType=${imgType}&typeId=${typeId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        return response;
    }
    
    // Delete an image
    async deleteImage(imageId) {
        const response = await axios.delete(
            `${API_URL}/delete` + `/` + imageId,
        );
        return response;
    }
}

export default new ImageService();