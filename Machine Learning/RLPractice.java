import java.util.Random;

public class RLPractice {
	
	public static final int NUM_ROWS = 2;
	public static final int NUM_COLS = 4;
	public static final int NUM_ACTIONS = 4;
	
	public static final double DISCOUNT = 0.9;
	public static final double EPSILON = 0.01;
	public static final double SUCCESS_FACTOR = 0.91;
	
	private double P[][][]; 
	private double R[][];  
	private int nStates = NUM_ROWS * NUM_COLS;
	
	private int curState;
	private int curStep;

	public RLPractice() {
		init();
	}

	public void init() {
		Random rnd = new Random();
		P = new double[NUM_ACTIONS][nStates][nStates];
		R = new double[NUM_ACTIONS][nStates];
		
		for (int i = 0; i < NUM_ACTIONS; i++) { 
			for (int j = 0; j < nStates; j++) {
				double reward = (rnd.nextInt(10) - 6) * 2;
				int up = j - NUM_COLS;
				if (up < 0) up += nStates;
				int down = j + NUM_COLS;
				if (down >= nStates) down -= nStates;
				int curCol = j % NUM_COLS;
				int left = curCol == 0 ? j + NUM_COLS - 1 : j - 1;
				int right = curCol == NUM_COLS - 1 ? j - NUM_COLS + 1 : j + 1;

				R[i][j] = reward;
				for (int k = 0; k < nStates; k++) {
					switch (i) {
					case 0: 
						P[i][j][k] = (k == up) ? SUCCESS_FACTOR : (k == left || k == right || k == down) ? (1 - SUCCESS_FACTOR) / 3 : 0;
						break;
					case 1: 
						P[i][j][k] = (k == right) ? SUCCESS_FACTOR : (k == left || k == up || k == down) ? (1 - SUCCESS_FACTOR) / 3 : 0;
						break;
					case 2: 
						P[i][j][k] = (k == left) ? SUCCESS_FACTOR : (k == up || k == right || k == down) ? (1 - SUCCESS_FACTOR) / 3 : 0;
						break;
					case 3: 
						P[i][j][k] = (k == down) ? SUCCESS_FACTOR : (k == left || k == right || k == up) ? (1 - SUCCESS_FACTOR) / 3 : 0;
						break;
					}
				}
			}
		}
		curState = rnd.nextInt(nStates);
		curStep = 0;
	}

	public double reward(int state, int action) {
		if (action < 0 || state < 0 || action >= NUM_ACTIONS || state >= nStates) 
			throw new IllegalArgumentException("Invalid state or action");
		return R[action][state];
	}

	public int getNextState(int state, int action) {
		double[] nextStates = P[action][state];
		double rnd = (new Random()).nextDouble();
		double sofar = 0;
		for (int i = 0; i < nextStates.length; i++) {
			sofar += nextStates[i];
			if (sofar > rnd) return i;
		}
		return nextStates.length - 1;
	}

	public int getNumActions() { return NUM_ACTIONS; }
	public int getNumStates() { return nStates; }

	public double[] valueIteration() {
		double[] V = new double[nStates];
		double delta;
		do {
			delta = 0;
			double[] newV = new double[nStates];
			for (int s = 0; s < nStates; s++) {
				double maxVal = Double.NEGATIVE_INFINITY;
				for (int a = 0; a < NUM_ACTIONS; a++) {
					double sum = 0;
					for (int sPrime = 0; sPrime < nStates; sPrime++) {
						sum += P[a][s][sPrime] * (R[a][s] + DISCOUNT * V[sPrime]);
					}
					maxVal = Math.max(maxVal, sum);
				}
				newV[s] = maxVal;
				delta = Math.max(delta, Math.abs(newV[s] - V[s]));
			}
			V = newV;
		} while (delta > EPSILON);
		return V;
	}

	public static double[][] qLearning(RLPractice mdp, double gamma, double epsilon) {
		double[][] Q = new double[mdp.getNumStates()][mdp.getNumActions()];
		Random rnd = new Random();
		for (int episode = 0; episode < 1000; episode++) {
			int state = rnd.nextInt(mdp.getNumStates());
			for (int step = 0; step < 100; step++) {
				int action = (rnd.nextDouble() < epsilon) ? rnd.nextInt(mdp.getNumActions()) : bestAction(Q, state);
				int nextState = mdp.getNextState(state, action);
				double reward = mdp.reward(state, action);
				double maxQ = Double.NEGATIVE_INFINITY;
				for (int a = 0; a < mdp.getNumActions(); a++) {
					maxQ = Math.max(maxQ, Q[nextState][a]);
				}
				Q[state][action] += 0.1 * (reward + gamma * maxQ - Q[state][action]);
				state = nextState;
			}
		}
		return Q;
	}

	public static double[][] sarsa(RLPractice mdp, double gamma, double epsilon) {
		double[][] Q = new double[mdp.getNumStates()][mdp.getNumActions()];
		Random rnd = new Random();
		for (int episode = 0; episode < 1000; episode++) {
			int state = rnd.nextInt(mdp.getNumStates());
			int action = bestAction(Q, state);
			for (int step = 0; step < 100; step++) {
				int nextState = mdp.getNextState(state, action);
				int nextAction = bestAction(Q, nextState);
				double reward = mdp.reward(state, action);
				Q[state][action] += 0.1 * (reward + gamma * Q[nextState][nextAction] - Q[state][action]);
				state = nextState;
				action = nextAction;
			}
		}
		return Q;
	}

	private static int bestAction(double[][] Q, int state) {
		int best = 0;
		for (int a = 0; a < Q[state].length; a++) {
			if (Q[state][a] > Q[state][best]) best = a;
		}
		return best;
	}

public static void main(String[] args) {
    RLPractice rl = new RLPractice();
    rl.init();

    System.out.println("Value iteration:");
    double[] vals = rl.valueIteration();

    System.out.println("--------------------------------------------\nQ-learning:");
    double[][] qvals = RLPractice.qLearning(rl, 0.99, 0.05);
    System.out.println("Q(s1, a2) = " + qvals[0][1]);

    System.out.println("--------------------------------------------\nSARSA:");
    qvals = RLPractice.sarsa(rl, 0.99, 0.05);
    System.out.println("Q(s2, a1) = " + qvals[1][0]);
}

}
