const images = {
    "Goa":
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200",

    "Goa, India":
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200",

    "Paris":
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",

    "Paris, France":
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",

    "Bali":
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1200",

    "Switzerland":
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",

    "Maldives":
        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200"
};

export default function getDestinationImage(destination) {

    return (

        images[destination] ||

        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200"

    );

}