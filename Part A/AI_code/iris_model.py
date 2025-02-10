import joblib
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score

iris = load_iris()
X, y = iris.data, iris.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.7, random_state=42)

pipeline = Pipeline([
    ('pca', PCA(n_components=2)),
    ('logreg', LogisticRegression(max_iter=200))
])

pipeline.fit(X_train, y_train)

y_pred = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Précision du modèle PCA + Régression Logistique : {accuracy:.2f}")

joblib.dump(pipeline, "iris_model.pkl")
print("Modèle PCA + Régression Logistique sauvegardé sous 'iris_model.pkl'")
