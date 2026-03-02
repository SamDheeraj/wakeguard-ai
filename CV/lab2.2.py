import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import affine_transform

# Read the same image using matplotlib (NO cv2)
img = plt.imread("image.jpg")  
if img is None:
    raise FileNotFoundError("Image not found!")

# Convert to grayscale manually
gray = (0.299 * img[:,:,0] + 0.587 * img[:,:,1] + 0.114 * img[:,:,2]).astype(np.uint8)

h, w = gray.shape

# Helper to apply transformation matrix
def apply_affine(image, matrix):
    return affine_transform(image, matrix, output_shape=(h, w))

# Translation
T = np.array([[1, 0, -50],
              [0, 1, -30],
              [0, 0, 1]])
translated_m = apply_affine(gray, T[:2, :2])

# Rotation 45°
theta = np.deg2rad(45)
R = np.array([
    [np.cos(theta), -np.sin(theta), 0],
    [np.sin(theta), np.cos(theta), 0],
    [0, 0, 1]
])
rotated_m = apply_affine(gray, R[:2, :2])

# Zoom
zoom_m = apply_affine(gray, np.array([[1.3, 0],[0, 1.3]]))

# Flip horizontally (manually reverse axis)
flip_m = np.flip(gray, axis=1)

# Show manually-generated results
titles2 = ["Original Gray", "Translated", "Rotated", "Zoom", "Flipped H"]
images2 = [gray, translated_m, rotated_m, zoom_m, flip_m]

plt.figure(figsize=(10, 7))
for i in range(len(images2)):
    plt.subplot(2, 3, i + 1)
    plt.imshow(images2[i], cmap="gray")
    plt.title(titles2[i])
    plt.axis("off")

plt.tight_layout()
plt.show()