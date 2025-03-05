import torch
import torch.nn as nn
from torchvision import datasets
from torchvision import transforms
import matplotlib.pyplot as plt


if torch.cuda.is_available():
    device = torch.device("cuda")
    print("cuda")
else:
    device = torch.device("cpu")
    print("No cuda")

train_dataset = datasets.MNIST(root = "./data", train = True,download = True, transform = transforms.ToTensor())
test_dataset = datasets.MNIST(root = "./data", train = False,download = True, transform = transforms.ToTensor())

class Autoencoder(nn.Module):
    def __init__(self):
        super(Autoencoder, self).__init__()

        self.flatten = nn.Flatten()

        self.encoder = nn.Sequential(
            nn.Linear(784, 300),
            nn.ReLU(),
            nn.Linear(300, 256),
            nn.ReLU()
        )

        self.decoder = nn.Sequential(
            nn.Linear(256, 300),
            nn.ReLU(),
            nn.Linear(300, 784),
            nn.Sigmoid()
        )
    
    def forward(self, x):
        x = self.flatten(x)
        x = self.encoder(x)
        x = self.decoder(x)
        x = x.unflatten(1, (1, 28, 28))
        return x

def training(batch_size, epochs = 5):
    train_loader = torch.utils.data.DataLoader(train_dataset, batch_size= batch_size)
    model = Autoencoder().to(device)
    optimizer = torch.optim.Adam(model.parameters(), 0.01)
    MSE = nn.MSELoss()
    loss_list = []
    for epoch in range(epochs):
        epoch_loss = 0
        for data in train_loader:
            images, _ = data
            images = images.to(device)
            optimizer.zero_grad()
            output = model(images)
            loss = MSE(output, images)
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()
        epoch_loss = epoch_loss / len(train_loader)
        loss_list.append(epoch_loss)
        print(f"Epoch {epoch+1}, Training loss: {epoch_loss:.6f} at Batch size {batch_size}")

    return loss_list

if __name__ == "__main__":
    epochs = 5

    batch_sizes = [32, 64, 128, 256]
    loss_list = [[] for i in range(len(batch_sizes))]

    for i in range(len(batch_sizes)):
        loss_list[i] = training(batch_sizes[i], epochs)

    plt.figure(figsize=(10,5))
    for i in range(len(batch_sizes)): 
        plt.plot(range(len(loss_list[i])),loss_list[i], label=f"Batch size = {batch_sizes[i]}")

    plt.title("MSE (y-axis) change over epochs (x-axis)")
    plt.xlabel("Epoch")
    plt.ylabel("MSE")
    plt.grid(True)
    plt.xticks(range(len(loss_list[i])))
    plt.legend()
    plt.savefig("training_curve.png")
    plt.show()

