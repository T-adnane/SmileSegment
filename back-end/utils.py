from visdom import Visdom
import socket
import numpy as np
import os

# Classe AverageMeter pour calculer et stocker la moyenne et la valeur actuelle
class AverageMeter(object):
    def __init__(self):
        self.reset()

    def reset(self):
        self.val = 0  # Valeur actuelle
        self.avg = 0  # Moyenne
        self.sum = 0  # Somme cumulative
        self.count = 0  # Nombre d'échantillons

    def update(self, val, n=1):
        self.val = val
        self.sum += val * n
        self.count += n
        self.avg = self.sum / self.count  # Mise à jour de la moyenne

# Classe VisdomLinePlotter pour tracer des graphiques avec Visdom
class VisdomLinePlotter(object):
    def __init__(self, env_name='main'):
        self.viz = Visdom()
        self.env = env_name
        self.plots = {}

    def plot(self, var_name, split_name, title_name, x, y):
        if var_name not in self.plots:
            # Crée un nouveau tracé s'il n'existe pas encore
            self.plots[var_name] = self.viz.line(X=np.array([x, x]), Y=np.array([y, y]), env=self.env, opts=dict(
                legend=[split_name],
                title=title_name,
                xlabel='Epochs',
                ylabel=var_name
            ))
        else:
            # Met à jour un tracé existant en ajoutant de nouvelles données
            self.viz.line(X=np.array([x]), Y=np.array([y]), env=self.env, win=self.plots[var_name], name=split_name, update='append')

# Fonction pour obtenir le GPU disponible (fonctionne sous Linux)
def get_avail_gpu():
    result = os.popen("nvidia-smi").readlines()

    try:
        # Obtenir la ligne des processus GPU
        for i in range(len(result)):
            if 'Processes' in result[i]:
                process_idx = i

        # Obtenir le nombre de GPU
        num_gpu = 0
        for i in range(process_idx + 1):
            if 'MiB' in result[i]:
                num_gpu += 1
        gpu_list = list(range(num_gpu))

        # Détecter lequel est occupé
        for i in range(process_idx, len(result)):
            if result[i][22] == 'C':
                gpu_list.remove(int(result[i][5]))

        return gpu_list[0]
    except:
        print('Aucun GPU disponible, renvoie 0')
        return 0
