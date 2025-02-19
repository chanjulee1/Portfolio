import numpy as np
import numpy.random as nr
import cv2 # You don't have to use this package, although I find it useful to have it around.

class MyCNN:
    # You may freely modify the constructor in any way you want.

    # TODO: Implement conv() and pool(). Should be able to handle various values of stride and padding.
    # The size of 'img' is bs x nc x w x h (bs == batch size, nc == number of channels)
    # The size of 'filters' is ni x w x h x no, where 'ni' is the number of input channels and 'no' is the number of output channels.
    def conv(self, img, filters, stride=1, padding=0):
        bs, nc, iw, ih = img.shape
        ni, fw, fh, no = filters.shape
        img = np.pad(img, ((0, 0), (0, 0), (padding, padding), (padding, padding)))
        
        ow = (iw + 2 * padding - fw) // stride + 1
        oh = (ih + 2 * padding - fh) // stride + 1

        out = np.zeros((bs, no, ow, oh))

        for b in range(bs):
            for n in range(no):
                for w in range(ow):
                    for h in range(oh):
                        w_start = w * stride
                        h_start = h * stride
                        w_end = w_start + fw
                        h_end = h_start + fh

                        out[b,n,w,h] = np.sum(np.multiply(img[b,:,w_start:w_end,h_start:h_end],filters[:,:,:,n]))
        return out

    # TODO: Implement pooling. The 'ptype' variable can be either 'max' or 'avg' (max pooling and average pooling).
    def pool(self, img, size=2, stride=2, padding=0, ptype='max'):
        bs, nc, iw, ih = img.shape
        img = np.pad(img, ((0, 0), (0, 0), (padding, padding), (padding, padding)))

        ow = (iw + 2 * padding - size) // stride + 1
        oh = (ih + 2 * padding - size) // stride + 1
        
        if ptype == 'max':
            return np.max(img.reshape(bs, nc, oh, size, ow, size).swapaxes(-2, -3), axis=(-1, -2))  
        if ptype == 'avg':
            return np.mean(img.reshape(bs, nc, oh, size, ow, size).swapaxes(-2, -3), axis=(-1, -2)) 

    # TODO: Implement a conv-pool-relu-conv-pool-relu-conv-pool-relu network using the above two methods.
    # The input 'x' should have dimensionality num_channels x 400 x 400.
    def forward(self, x):
        x = np.expand_dims(x, axis=0)

        filters1 = np.random.rand(3, 3, 3, 5) 
        filters2 = np.random.rand(5, 3, 3, 5)  

        x = self.conv(x, filters1, padding=1)
        x = self.pool(x)
        x = np.maximum(0, x)

        x = self.conv(x, filters2, padding=1)
        x = self.pool(x)
        x = np.maximum(0, x)
         
        filters3 = np.zeros((5, 3, 3, 6))  
        filters3[:, :, :, 0] = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]] # vertical edge detection 
        filters3[:, :, :, 1] = [[1, 1, 1], [0, 0, 0], [-1, -1, -1]] # horizontal edge detection 
        filters3[:, :, :, 2] = [[1/9, 1/9, 1/9], [1/9, 1/9, 1/9], [1/9, 1/9, 1/9]] # blur 
        filters3[:, :, :, 3] = [[0, 1, 0], [1, -4, 1], [0, 1, 0]] # laplacian 
        filters3[:, :, :, 4] = [[1, 1, 0], [0, 0, 0], [-1, -1, 0]] # diagonal edge detection
        filters3[:, :, :, 5] = [[0, -1, 0], [-1, 5, -1], [0, -1, 0]] # sharpen

        x = self.conv(x, filters3, padding=1)
        x = self.pool(x)
        x = np.maximum(0, x)

        return x[0]

# Below is just a test code for your reference.
# This is one way to use the conv() and pool() methods above
def main(imfile='img.jpeg', outname='output'):
    bs = 16     # Minibatch size
    size = 800  # Input image size (w, h)
    filter_size = 5 # Choose your preferred size
    num_out_maps = 10 # Number of output feature maps.
    num_in_maps = 3

    img = cv2.imread(imfile)
    img = cv2.resize(img, (size, size))
    img = np.transpose(img, (2, 0, 1)) # Permute the dimensions so the image shape is 3x400x400

    net = MyCNN()
    out = net.forward(img)

    for i in range(6):
        image = (out[i] - out[i].min()) / (out[i].max() - out[i].min()) * 255
        image = image.astype(np.uint8)
        cv2.imwrite(f"image{i}.jpeg", image)

if __name__ == '__main__':
    main()
