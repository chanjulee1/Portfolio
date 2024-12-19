import java.net.*;
import java.io.*;

public class PingClient {

    /** Socket which we use. */
    DatagramSocket socket;

    /** Set maximum length of a ping message to 512. */
    final int maxLength = 512;

    /** Create a datagram socket with random port for sending UDP messages */
    public void createSocket() {
        try {
            socket = new DatagramSocket();
        } catch (SocketException e) {
            System.out.println("Error creating socket: " + e);
        }
    }

    /** Create a datagram socket for receiving UDP messages. 
     * This socket must be bound to the given port. */
    public void createSocket(int port) {
        try {
            socket = new DatagramSocket(port);
        } catch (SocketException e) {
            System.out.println("Error creating socket: " + e);
        }
    }

    /** Send a UDP ping message which is given as the argument. */
    public void sendPing(Message ping) {
        InetAddress host = ping.getIP();
        int port = ping.getPort();
        /* Create a datagram packet addressed to the recipient */
        try {
            byte[] pData = ping.getContents().getBytes();
            DatagramPacket dp = new DatagramPacket(pData, pData.length, host, port);
            /* Send the packet */
            socket.send(dp);
            System.out.println("Sent message to " + host + ":" + port);
        } catch (IOException e) {
            System.out.println("Error sending packet: " + e);
        }
    } 

    /** Receive a UDP ping message and return the received message. 
     * We throw an exception to indicate that the socket timed out. 
     * This can happen when a message is lost in the network. */
    public Message receivePing() throws SocketTimeoutException {
        /* Create packet for receiving the reply */
        byte[] rData = new byte[maxLength];
        DatagramPacket receivePacket = new DatagramPacket(rData, rData.length);

        try {
            socket.receive(receivePacket);
            String receivedMessage = new String(receivePacket.getData(), 0, receivePacket.getLength());
            return new Message(receivePacket.getAddress(), receivePacket.getPort(), receivedMessage);
        } catch (SocketTimeoutException e) {
            throw e;
        } catch (IOException e) {
            System.out.println("Error reading from socket: " + e);
        }
        return null;
    }
}
