> # DEPRECATED in favor of https://github.com/apps/blueracer-io


# BlueRacer

PyTest durations reporter for GitHub.

## How to use

```yaml
...
      - uses: teamniteo/blueracer-action@main
        id: blueracer
        with:
          durations-file: test_durations.csv
          percentage-warn: 10 # optional
          percentage-error: 30 # optional

      - name: Find Comment
        uses: peter-evans/find-comment@main
        id: fc
        if: github.event_name == 'pull_request'
        with:
          issue-number: ${{ github.event.pull_request.number }}
          body-includes: "### BlueRacer unit tests"

      - name: Create or update comment
        uses: peter-evans/create-or-update-comment@main
        if: github.event_name == 'pull_request'
        with:
          comment-id: ${{ steps.fc.outputs.comment-id }}
          issue-number: ${{ github.event.pull_request.number }}
          body: ${{ steps.blueracer.outputs.report }}
          edit-mode: replace
```

## Developing and Releasing

see https://github.com/actions/typescript-action
