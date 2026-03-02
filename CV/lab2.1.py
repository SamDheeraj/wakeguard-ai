import cv2
import numpy as np
import matplotlib.pyplot as plt

IMAGE_PATH = "image.jpg"  


# Load image
img = cv2.imread(IMAGE_PATH)
if img is None:
    raise FileNotFoundError("Check IMAGE_PATH. File not found!")

img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Convert BGR → RGB for matplotlib

h, w = img.shape[:2]

# Translation (shift by +50 right, +30 down)
T = np.float32([[1, 0, 50], [0, 1, 30]])
translated = cv2.warpAffine(img, T, (w, h))
#4591 8160
# Rotation (45 degrees)
center = (w // 2, h // 2)
rotation_matrix = cv2.getRotationMatrix2D(center, 45, 1.0)
rotated = cv2.warpAffine(img, rotation_matrix, (w, h))

# Resizing (Zoom-in & Zoom-out)
resized_small = cv2.resize(img, None, fx=0.5, fy=0.5)  # smaller
resized_large = cv2.resize(img, None, fx=1.5, fy=1.5)  # bigger

# Flipping
flip_h = cv2.flip(img, 1)  # horizontal
flip_v = cv2.flip(img, 0)  # vertical

# Display results
titles = [
    "Original", "Translated", "Rotated 45°",
    "Zoom-Out", "Zoom-In",
    "Flip Horizontal", "Flip Vertical"
]
images = [
    img, translated, rotated,
    resized_small, resized_large,
    flip_h, flip_v
]

plt.figure(figsize=(12, 8))
for i in range(len(images)):
    plt.subplot(2, 4, i + 1)
    plt.imshow(images[i])
    plt.title(titles[i])
    plt.axis("off")

plt.tight_layout()
plt.show()