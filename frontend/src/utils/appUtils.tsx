import { API_URL } from "../apollo/client";
import { AnimationItemProps } from "../components/AnimationItem";
export const strokeLinejoin: "inherit" | "round" | "miter" | "bevel" = "round";

export const handleDownload = (animation: AnimationItemProps, isOnline: boolean = true) => {
    if (isOnline) {
        let fileUrl = API_URL + "/uploads/" + animation.path;
        fetch(fileUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = animation.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch(err => console.error('Download error:', err));
    } else {
        const link = document.createElement('a');
       if(animation.base64Image) link.href = animation.base64Image;
        link.download = animation.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};