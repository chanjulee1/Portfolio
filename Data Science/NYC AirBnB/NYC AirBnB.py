import pandas as pd
import seaborn as sb
import matplotlib.pyplot as plt 
import matplotlib.patches as mpatches
from wordcloud import WordCloud
import seaborn as sns
from scipy.stats import pearsonr

# Load dataset
df = pd.read_csv('AB_NYC_2019.csv') 

# Remove NaN values
df = df.dropna()

# Remove leading/trailing whitespaces from string columns
for col in df.select_dtypes(include='object').columns:
    df[col] = df[col].astype(str).str.strip()

# Filter out listings with price = 0
df = df[df['price'] > 0]

# Remove duplicate listings
df.drop_duplicates(inplace=True)

# Filter out neighborhoods with 5 or fewer listings
df_filtered = df[df.groupby('neighbourhood')['price'].transform('count').gt(5)]

# Get the most expensive listing per neighborhood
df_neighbourhoods = df_filtered.groupby('neighbourhood')['price'].max().reset_index()

# Display the top 5 most expensive neighborhoods
print('The 5 most expensive neighbourhoods are: ')
print(df_neighbourhoods.nlargest(5, 'price'))

# Get the cheapest listing per neighborhood
df_neighbourhoods = df_filtered.groupby('neighbourhood')['price'].min().reset_index()

# Display the top 5 cheapest neighborhoods
print('\nThe 5 most cheapest neighbourhoods are: ')
print(df_neighbourhoods.nsmallest(5, 'price'))

# Compute the average price per neighborhood group
neighbourhood_groups_x = df_filtered.groupby('neighbourhood_group')['price'].mean().reset_index()

# Plot average price per neighborhood group
plt.bar(neighbourhood_groups_x['neighbourhood_group'], neighbourhood_groups_x['price'])
plt.xlabel('Neighborhood Group')
plt.ylabel('Average Price')
plt.title('Neighborhood Group Airbnb Average Prices')
plt.tight_layout()
plt.show()

# Compute Pearson correlation between selected features
selected_features = df[['price','number_of_reviews','minimum_nights','availability_365','reviews_per_month']].copy()
correlation = selected_features.corr(method='pearson')

# Create heatmap for correlation
dataplot = sb.heatmap(correlation, annot=True) 
dataplot.set_xticklabels(dataplot.get_xticklabels(), rotation=0)
plt.tight_layout()
plt.show()

# Filter out strongest positive and negative correlations
corr_data = correlation.unstack().sort_values()
corr_data_filtered = corr_data[corr_data != 1]
print(f"Two pairs that are most positively correlated are: {corr_data[corr_data == corr_data_filtered.max()].head(1).to_string()}")
print(f"Two pairs that are most negatively correlated are: {corr_data[corr_data == corr_data_filtered.min()].head(1).to_string()}")

# Filter listings with price < 1000
price_df = df[df['price'] < 1000]

# Prepare data for scatter plot
plot_df = price_df[['longitude', 'latitude', 'neighbourhood_group','price']].copy()

# Encode neighborhood group as categorical colors
groups = plot_df.neighbourhood_group.astype("category")
color = groups.cat.codes

# Scatter plot of listings by neighborhood group
scatter = plt.scatter(x=plot_df['longitude'], y=plot_df['latitude'], c=color)

# Create legend for neighborhood groups
handles = [
    mpatches.Patch(color=scatter.cmap(scatter.norm(i)), label=label)
    for i, label in enumerate(groups.cat.categories)
]
plt.legend(handles=handles)
plt.xlabel('Longitude')
plt.ylabel('Latitude')
plt.title('Scatter Plot of Airbnb in NYC by neighborhood group')
plt.tight_layout()
plt.show()

# Scatter plot of listings colored by price
scatter2 = plt.scatter(x=plot_df['longitude'], y=plot_df['latitude'], c=plot_df['price'])
colorbar = plt.colorbar(scatter2)
ticks = [plot_df['price'].min()] + list(range(100, 1100, 100))
colorbar.set_ticks(ticks)
colorbar.set_ticklabels([int(tick) for tick in ticks])
colorbar.set_label('Price')
plt.xlabel('Longitude')
plt.ylabel('Latitude')
plt.title('Scatter Plot of Airbnb in NYC by price')
plt.tight_layout()
plt.show()

# Generate a word cloud for Airbnb listing names
text = " ".join(df['name'].astype(str).str.lower())
wordcloud = WordCloud(width=800, height=400, background_color='white').generate(text)
plt.imshow(wordcloud)
plt.axis('off')
plt.title('Airbnb Listing Names Word Cloud')
plt.show()

# Identify the busiest hosts
host_df = df.drop_duplicates(subset=['host_id'])
host_ids = host_df.nlargest(10, 'calculated_host_listings_count')[['host_id', 'calculated_host_listings_count']]
print(host_ids)

# Identify busiest neighborhoods
busy_neighborhoods = df[df['host_id'].isin(host_ids['host_id'])].groupby('neighbourhood').size()
print(busy_neighborhoods.sort_values(ascending=False).head())

# Plot statistics for busiest hosts
frequencies, prices, minimum_nights, availabilities, reviews_per_month = [], [], [], [], []
for host_id in host_ids['host_id']:
    host_listings = df[df['host_id'] == host_id]
    frequencies.append(len(host_listings))
    prices.append(host_listings['price'].mean())
    minimum_nights.append(host_listings['minimum_nights'].mean())
    availabilities.append(host_listings['availability_365'].mean())
    reviews_per_month.append(host_listings['reviews_per_month'].mean())

# Plot host statistics
plt.plot(host_ids['host_id'].astype(str), frequencies, marker='o', label='Frequency')
plt.plot(host_ids['host_id'].astype(str), prices, marker='o', label='Average Price')
plt.plot(host_ids['host_id'].astype(str), minimum_nights, marker='o', label='Average Minimum Nights')
plt.plot(host_ids['host_id'].astype(str), availabilities, marker='o', label='Average Availability (365 days)')
plt.plot(host_ids['host_id'].astype(str), reviews_per_month, marker='o', label='Average Reviews Per Month')
plt.xlabel('Host ID')
plt.ylabel('Values')
plt.title('Busiest Hosts Relevant Statistics')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()

# Calculate Pearson correlation between number of listings and average price
num_listings = df['host_id'].value_counts().reset_index()
avg_price = df.groupby('host_id')['price'].mean().reset_index()
num_listings.columns = ['host_id', 'num_listings']
avg_price.columns = ['host_id', 'avg_price']
host_stats = pd.merge(num_listings, avg_price, on='host_id')
corr, _ = pearsonr(host_stats['num_listings'], host_stats['avg_price'])
print('Pearsons correlation: %.3f' % corr)

# Scatter plot of number of listings vs average price
sns.scatterplot(x='num_listings', y='avg_price', data=host_stats)
sns.regplot(x='num_listings', y='avg_price', data=host_stats, scatter=False, color='r')
plt.xlabel('Number of Listings per Host')
plt.ylabel('Average Price')
plt.title('Scatter Plot of Average Price vs Number of Listings per Host')
plt.grid(True)
plt.tight_layout()
plt.show()
