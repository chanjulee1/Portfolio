import java.net.*;

public class UDPServer {

    public static void main(String args[]) throws Exception {    
        int port = 0;

        /** Parse port number from command line **/
        try {
            port = Integer.parseInt(args[0]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Need one argument: port number.");
            System.exit(-1);
        } catch (NumberFormatException e) {
            System.out.println("Please give port number as integer.");
            System.exit(-1);
        }

        /** Create a new datagram socket at the port **/
        DatagramSocket serverSocket = new DatagramSocket(port);

        /** Let the user know the server is running **/
        System.out.println("The UDP server is listening on port " + port);

        int pingCount = 0;

        while (true) {
            /** Create a new datagram packet and let the socket receive it **/
            byte[] pData = new byte[65507];
            DatagramPacket dp = new DatagramPacket(pData, pData.length);
            serverSocket.receive(dp);

            /** Print the message received **/
            String message = new String(dp.getData());
            System.out.println("PING " + pingCount + " " + message);
            pingCount++;

            /** Get the IP Address of the Sender **/
            InetAddress senderAddress = dp.getAddress();

            /** Get the port of the Sender **/
            int senderPort = dp.getPort();

            /** Prepare the data to send back **/
            byte[] sendData = message.getBytes();

            /** Send the packet **/
            DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, senderAddress, senderPort);
            serverSocket.send(sendPacket);
        }
    }
}
