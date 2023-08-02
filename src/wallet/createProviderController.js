import {ProviderController} from 'web3modal';
import { getETHNetwork } from './test';

const CONNECT_EVENT = "connect";
const ERROR_EVENT = "error";

export const createProviderController = () => {
  const connectors = getETHNetwork().connectors
  const providerController = new ProviderController(connectors)

  return {
    connect: () => {
      return new Promise(async (resolve, reject) => {
        providerController.on(CONNECT_EVENT, provider => resolve(provider));
        providerController.on(ERROR_EVENT, error => reject(error));
        if (providerController.cachedProvider) {
          await providerController.connectToCachedProvider();
        }
      });
    },
    connectTo: (id) => {
      return new Promise(async (resolve, reject) => {
        providerController.on(CONNECT_EVENT, provider => resolve(provider));
        providerController.on(ERROR_EVENT, error => reject(error));
        const provider = providerController.getProvider(id);
        if (!provider) {
          return reject(
            new Error(
              `Cannot connect to provider (${id}), check provider options`
            )
          );
        }
        await providerController.connectTo(provider.id, provider.connector);
      });
    },
    clearCachedProvider: () => {
      providerController.clearCachedProvider()
    }
  }
}
