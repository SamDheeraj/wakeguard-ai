import cv2
import numpy as np
import os

INPUT_IMAGE_PATH = "image.jpg" 

OUTPUT_DIR = "denoising_experiment"   

GAUSSIAN_NOISE_SIGMA = 20            
SALT_PEPPER_AMOUNT = 0.03             

GAUSSIAN_BLUR_SIGMA = 10              
MEDIAN_KERNEL_SIZE = 5                
BILATERAL_D = 9                      
BILATERAL_SIGMA_COLOR = 50            
BILATERAL_SIGMA_SPACE = 50            




def ensure_output_dir(path):
    os.makedirs(path, exist_ok=True)


def save_step(name, img):
    filename = os.path.join(OUTPUT_DIR, f"{name}.png")
    cv2.imwrite(filename, img)
    print("Saved:", filename)


#  Noise functions

def add_gaussian_noise(image, mean=0, sigma=20):
    img_float = image.astype(np.float32)
    h, w, c = img_float.shape
    noise = np.random.normal(mean, sigma, (h, w, c)).astype(np.float32)
    noisy = img_float + noise
    noisy = np.clip(noisy, 0, 255).astype(np.uint8)
    return noisy


def add_salt_pepper_noise(image, amount=0.02, s_vs_p=0.5):
 
    noisy = image.copy()
    h, w, c = noisy.shape
    num_pixels = h * w

    # Salt (white) pixels
    num_salt = int(num_pixels * amount * s_vs_p)
    coords = (np.random.randint(0, h, num_salt),
              np.random.randint(0, w, num_salt))
    noisy[coords] = 255

    # Pepper (black) pixels
    num_pepper = int(num_pixels * amount * (1.0 - s_vs_p))
    coords = (np.random.randint(0, h, num_pepper),
              np.random.randint(0, w, num_pepper))
    noisy[coords] = 0

    return noisy



def main():
    ensure_output_dir(OUTPUT_DIR)

    # Step 1: Read clean image
    img = cv2.imread(INPUT_IMAGE_PATH)
    if img is None:
        raise FileNotFoundError(
            f"Could not read image at '{INPUT_IMAGE_PATH}'. "
            f"Check the file name/path."
        )

    save_step("step1_clean_image", img)


    # Step 2: Add Gaussian noise
    gaussian_noisy = add_gaussian_noise(
        img,
        mean=0,
        sigma=GAUSSIAN_NOISE_SIGMA
    )
    save_step(f"step2_gaussian_noise_sigma{GAUSSIAN_NOISE_SIGMA}", gaussian_noisy)

    # Step 3a: Gaussian Blur on Gaussian-noisy image

    gauss_blur = cv2.GaussianBlur(
        gaussian_noisy,
        ksize=(0, 0),
        sigmaX=GAUSSIAN_BLUR_SIGMA
    )
    save_step(
        f"step3a_gaussianNoise_gaussianBlur_sigma{GAUSSIAN_BLUR_SIGMA}",
        gauss_blur
    )

    # Step 3b: Median Filter
    median_gauss = cv2.medianBlur(gaussian_noisy, MEDIAN_KERNEL_SIZE)
    save_step(
        f"step3b_gaussianNoise_median_k{MEDIAN_KERNEL_SIZE}",
        median_gauss
    )

    # Step 3c: Bilateral Filter
    bilateral_gauss = cv2.bilateralFilter(
        gaussian_noisy,
        d=BILATERAL_D,
        sigmaColor=BILATERAL_SIGMA_COLOR,
        sigmaSpace=BILATERAL_SIGMA_SPACE
    )
    save_step(
        f"step3c_gaussianNoise_bilateral_d{BILATERAL_D}_sc{BILATERAL_SIGMA_COLOR}",
        bilateral_gauss
    )

    # Step 4: Add Salt & Pepper Noise
    sp_noisy = add_salt_pepper_noise(
        img,
        amount=SALT_PEPPER_AMOUNT,
        s_vs_p=0.5
    )
    save_step(f"step4_saltPepper_noise_amt{SALT_PEPPER_AMOUNT}", sp_noisy)

    # Step 5a: Gaussian Blur on S&P noisy image
    gauss_blur_sp = cv2.GaussianBlur(
        sp_noisy,
        ksize=(0, 0),
        sigmaX=GAUSSIAN_BLUR_SIGMA
    )
    save_step(
        f"step5a_saltPepper_gaussianBlur_sigma{GAUSSIAN_BLUR_SIGMA}",
        gauss_blur_sp
    )

    # Step 5b: Median Filter (this is usually BEST for S&P)
    median_sp = cv2.medianBlur(sp_noisy, MEDIAN_KERNEL_SIZE)
    save_step(
        f"step5b_saltPepper_median_k{MEDIAN_KERNEL_SIZE}",
        median_sp
    )

    # Step 5c: Bilateral Filter on S&P noisy image
    bilateral_sp = cv2.bilateralFilter(
        sp_noisy,
        d=BILATERAL_D,
        sigmaColor=BILATERAL_SIGMA_COLOR,
        sigmaSpace=BILATERAL_SIGMA_SPACE
    )
    save_step(
        f"step5c_saltPepper_bilateral_d{BILATERAL_D}_sc{BILATERAL_SIGMA_COLOR}",
        bilateral_sp
    )

    print("\nAll steps completed.")


if __name__ == "__main__":
    main()