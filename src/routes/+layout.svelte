<script>
import "../app.pcss";

import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

import { storePopup } from '@skeletonlabs/skeleton';
storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

</script>

<slot />
