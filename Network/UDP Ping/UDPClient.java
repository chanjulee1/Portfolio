import java.net.*;
import java.util.Date;

public class UDPClient extends PingClient {

    /** Host to ping */
    String remoteHost;

    /** Port number of remote host */
    int remotePort;

    /** How many pings to send */
    static final int NUM_PINGS = 10;

    /** How many reply pings have we received */
    int numReplies = 0;

    /** Create a 2D array for holding replies and RTTs */
    long[][] rttArray = new long[NUM_PINGS][2]; // [0] for replies, [1] for RTTs

    /** 1 second timeout for waiting replies */
    static final int TIMEOUT = 1000;

    /** 5 second timeout for collecting pings at the end */
    static final int REPLY_TIMEOUT = 5000;

    /** constructor **/
    public UDPClient(String host, int port) {
        this.remoteHost = host;
        this.remotePort = port;
    }

    /**
     * Main function. Read command line arguments and start the client.
     */
    public static void main(String args[]) {
        String host = null;
        int port = 0;

        /* Parse host and port number from command line */
        try {
            host = args[0];
            port = Integer.parseInt(args[1]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Need two arguments: remoteHost remotePort");
            System.exit(-1);
        } catch (NumberFormatException e) {
            System.out.println("Please give port number as integer.");
            System.exit(-1);
        }

        System.out.println("Contacting host " + host + " at port " + port);

        UDPClient client = new UDPClient(host, port);
        client.run();
    }

    public void run() {
        /* Create socket. We do not care which local port we use. */
        createSocket();
        try {
            socket.setSoTimeout(TIMEOUT);
        } catch (SocketException e) {
            System.out.println("Error setting timeout TIMEOUT: " + e);
        }

        for (int i = 0; i < NUM_PINGS; i++) {
            /* Message we want to send to server is the current date and time in milliseconds. */
            Date now = new Date();
            String message = String.valueOf(now.getTime());

            /* Send ping to recipient */
            try {
                Message ping = new Message(InetAddress.getByName(remoteHost), remotePort, message);
                sendPing(ping);
            } catch (UnknownHostException e) {
                System.out.println("Cannot find host: " + e);
            }

            /* Read the reply by getting the received ping message */
            try {
                Message reply = receivePing();
                System.out.println("Received message from " + reply.getIP() + ":" + reply.getPort());
                handleReply(reply.getContents());
            } catch (SocketTimeoutException e) {
                /* Reply did not arrive. Do nothing for now. Figure
                 * out lost pings later. */
            }
        }

        /* Set a longer timeout for waiting for remaining replies */
        try {
            socket.setSoTimeout(REPLY_TIMEOUT);
        } catch (SocketException e) {
            System.out.println("Error setting timeout REPLY_TIMEOUT: " + e);
        }

        while (numReplies < NUM_PINGS) {
            try {
                Message reply = receivePing();
                System.out.println("Received message from " + reply.getIP() + ":" + reply.getPort());
                handleReply(reply.getContents());
            } catch (SocketTimeoutException e) {
                /* Nothing coming our way apparently. Exit loop. */
                break;
            }
        }

        /* Print statistics */
        for (int i = 0; i < NUM_PINGS; i++) {
            System.out.println("Ping " + (i + 1) + ": " + rttArray[i][1] + " ms");
        }
    }

    private void handleReply(String reply) {
        /* Calculate RTT and store it in the rtt-array. */
        try {
            System.out.println("PING " + numReplies + " " + reply); // Enhanced debug statement
            long sendTime = Long.parseLong(reply.trim()); // Trim any extra whitespace
            long currentTime = System.currentTimeMillis();
            long rtt = currentTime - sendTime;
            rttArray[numReplies][0] = sendTime; // Store reply time
            rttArray[numReplies][1] = rtt;      // Store RTT
            numReplies++;
        } catch (NumberFormatException e) {
            System.out.println("Error parsing reply: [" + reply + "]"); // Enhanced error message
            e.printStackTrace();
        }
    }
}
